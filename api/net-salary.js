const { randomUUID } = require('crypto');
const { getSupabaseClient } = require('../lib/supabase');

const SESSION_HEADER = 'x-session-id';
const TABLE = 'salary_submissions';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST supported' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? safeParseJson(req.body) : (req.body || {});
    const { gross_monthly, year, tax_class, has_child = false, church_tax = false, health_extra_rate = 0 } = body;

    const validationError = validateInput({ gross_monthly, year, tax_class });
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const calc = calculateNet({
      gross: Number(gross_monthly),
      year: Number(year),
      taxClass: Number(tax_class),
      hasChild: Boolean(has_child),
      churchTax: Boolean(church_tax),
      healthExtraRate: Number(health_extra_rate) || 0
    });

    const headers = req.headers || {};
    const sessionId = headers[SESSION_HEADER] || randomUUID();
    const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    let submissionId;
    if (hasSupabase) {
      try {
        const supabase = getSupabaseClient();
        const insertPayload = {
          year: Number(year),
          gross_monthly: Number(gross_monthly),
          net_monthly: calc.net,
          tax_class: Number(tax_class),
          has_child: Boolean(has_child),
          church_tax: Boolean(church_tax),
          health_extra_rate: Number(health_extra_rate) || 0,
          session_id: sessionId,
          input_json: body,
          output_json: calc
        };

        const { data, error } = await supabase.from(TABLE).insert(insertPayload).select('id').single();
        if (error) throw error;
        submissionId = data.id;
      } catch (error) {
        console.error('Supabase insert skipped', error);
      }
    } else {
      console.warn('Supabase ortam değişkenleri eksik; sonuç kaydı atlanıyor.');
    }

    res.status(200).json({ ...calc, ...(submissionId ? { submission_id: submissionId } : {}), session_id: sessionId });
  } catch (err) {
    console.error('net-salary error', err);
    res.status(500).json({ message: 'Hesaplama sırasında hata oluştu' });
  }
};

function safeParseJson(str) {
  try { return JSON.parse(str || '{}'); } catch (_) { return {}; }
}

function validateInput({ gross_monthly, year, tax_class }) {
  if (!gross_monthly || Number(gross_monthly) <= 0) return 'Brüt maaş pozitif olmalı';
  if (![2024, 2025].includes(Number(year))) return 'Yalnızca 2024 ve 2025 destekleniyor';
  if (Number(tax_class) < 1 || Number(tax_class) > 6) return 'Vergi sınıfı 1-6 arasında olmalı';
  return null;
}

function calculateNet({ gross, year, taxClass, hasChild, churchTax, healthExtraRate }) {
  const ctx = getYearContext(year);
  const bases = getContributionBases(gross, ctx);
  const rates = getEmployeeRates({ ctx, hasChild, healthExtraRate });

  const pension = round2(bases.rv_alv * rates.pension);
  const unemployment = round2(bases.rv_alv * rates.unemployment);
  const health = round2(bases.kv_pv * rates.health);
  const care = round2(bases.kv_pv * rates.care);

  const socialTotal = round2(pension + unemployment + health + care);

  // Not: Bu hesaplama maaş bordrosu mantığına yakın bir tahmindir.
  // Gelir vergisi tarafında sınıf (1-6) üzerinden "Lohnsteuer benzeri" yaklaşım uygulanır.
  const taxableYearly = Math.max(0, gross * 12 - socialTotal * 12);
  const incomeTaxYearly = lohnsteuerApprox({ year, taxableYearly, taxClass, hasChild });
  const incomeTax = round2(incomeTaxYearly / 12);

  const solidarity = calcSolidarity({ year, incomeTaxYearly, taxClass });
  const church = churchTax ? round2(incomeTax * (ctx.churchRateDefault)) : 0;
  const taxesTotal = round2(incomeTax + solidarity + church);

  const net = round2(gross - socialTotal - taxesTotal);

  return {
    gross: round2(gross),
    net,
    taxes: {
      incomeTax,
      solidarity,
      church,
      total: taxesTotal
    },
    social: {
      pension,
      unemployment,
      health,
      care,
      total: socialTotal
    }
  };
}

/**
 * Yıl parametreleri (2024/2025).
 * Kaynak/temel: §32a EStG (tarif) ve resmi duyurular.
 * - 2024 Grundfreibetrag: 11.784 (rückwirkend erhöht)
 * - 2025 Grundfreibetrag: 12.096
 * - 2024/2025 tarif: §32a EStG (özet formüller)
 */
function getYearContext(year) {
  const y = Number(year);
  if (y === 2024) {
    return {
      year: 2024,
      bbg_kv_pv_monthly: 5175.0,
      bbg_rv_alv_monthly: 7550.0,
      soli_freigrenze_est: 18130,
      churchRateDefault: 0.09,
      est: {
        gf: 11784,
        t1: 17005,
        t2: 66760,
        t3: 277825,
        // 2. tarif formel
        y_a: 954.8,
        y_b: 1400,
        // 3. tarif formel
        z_a: 181.19,
        z_b: 2397,
        z_c: 991.21,
        // 4/5
        k1: 10636.31,
        k2: 18971.06
      }
    };
  }
  if (y === 2025) {
    return {
      year: 2025,
      bbg_kv_pv_monthly: 5512.5,
      bbg_rv_alv_monthly: 8050.0,
      soli_freigrenze_est: 19950,
      churchRateDefault: 0.09,
      est: {
        gf: 12096,
        t1: 17443,
        t2: 68480,
        t3: 277825,
        y_a: 932.3,
        y_b: 1400,
        z_a: 176.64,
        z_b: 2397,
        z_c: 1015.13,
        k1: 10911.92,
        k2: 19052.02
      }
    };
  }
  // fallback (ama zaten validateInput engelliyor)
  return getYearContext(2025);
}

function getContributionBases(grossMonthly, ctx) {
  const g = Number(grossMonthly) || 0;
  return {
    rv_alv: Math.min(g, ctx.bbg_rv_alv_monthly),
    kv_pv: Math.min(g, ctx.bbg_kv_pv_monthly)
  };
}

function getEmployeeRates({ ctx, hasChild, healthExtraRate }) {
  const healthExtraDecimal = (Number(healthExtraRate) || 0) / 100;
  // GKV: genel 14,6% (çalışan 7,3) + Zusatzbeitrag (yarı yarıya)
  // PV 2025: çocuklu 3,6; çocuksuz 4,2; çalışan payı sırasıyla 1,8 / 2,4
  // 2024 için PV oranları (basitleştirilmiş): çocuklu 3,4 → 1,7; çocuksuz 4,0 → 2,3 (çalışan) (yaklaşım)
  const careRate = ctx.year === 2025
    ? (hasChild ? 0.018 : 0.024)
    : (hasChild ? 0.017 : 0.023);

  return {
    pension: 0.093,
    unemployment: 0.013,
    health: 0.073 + (healthExtraDecimal / 2),
    care: careRate
  };
}

// §32a EStG tarif (Grundtarif) – yıllık ESt (tam sayı € aşağı yuvarlanır)
function estGrundtarif(ctx, zvE) {
  const x = Math.floor(Number(zvE) || 0);
  const p = ctx.est;
  let est = 0;

  if (x <= p.gf) {
    est = 0;
  } else if (x <= p.t1) {
    const y = (x - p.gf) / 10000;
    est = (p.y_a * y + p.y_b) * y;
  } else if (x <= p.t2) {
    const z = (x - p.t1) / 10000;
    est = (p.z_a * z + p.z_b) * z + p.z_c;
  } else if (x <= p.t3) {
    est = 0.42 * x - p.k1;
  } else {
    est = 0.45 * x - p.k2;
  }

  return Math.floor(est);
}

function estSplitting(ctx, zvE) {
  const half = (Number(zvE) || 0) / 2;
  return 2 * estGrundtarif(ctx, half);
}

function lohnsteuerApprox({ year, taxableYearly, taxClass, hasChild }) {
  const ctx = getYearContext(year);
  const zvE0 = Math.max(0, Number(taxableYearly) || 0);

  // Steuerklasse II: Entlastungsbetrag 4.260 €/Jahr
  const reliefSingleParent = (Number(taxClass) === 2 && hasChild) ? 4260 : 0;
  const zvE = Math.max(0, zvE0 - reliefSingleParent);

  // Baseline: sınıf 1/2/4: Grundtarif
  let est = estGrundtarif(ctx, zvE);

  // 3/5: splitting etkisi (tahmini bordro mantığı)
  if (Number(taxClass) === 3) est = estSplitting(ctx, zvE);
  if (Number(taxClass) === 5) est = Math.round(estSplitting(ctx, zvE) * 1.25);

  // 6: ikinci iş – daha yüksek kesinti (tahmin)
  if (Number(taxClass) === 6) est = Math.round(est * 1.1);

  return Math.max(0, est);
}

function calcSolidarity({ year, incomeTaxYearly, taxClass }) {
  const ctx = getYearContext(year);
  const est = Math.floor(Number(incomeTaxYearly) || 0);
  const threshold = (Number(taxClass) === 3 || Number(taxClass) === 5) ? (ctx.soli_freigrenze_est * 2) : ctx.soli_freigrenze_est;
  // Basit: Freigrenze altı 0, üstü %5,5. (Milderungszone yok)
  // Freigrenze değerleri (ESt bazlı): 2024 18.130 / 2025 19.950
  if (est <= threshold) return 0;
  return round2((est * 0.055) / 12);
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}
