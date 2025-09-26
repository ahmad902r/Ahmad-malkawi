
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { weekday: 'long' }).format(date);
};

export const formatHijriDate = (dateString: string): string => {
    const date = new Date(dateString);
     // Basic Hijri approximation, not perfectly accurate.
     // For production apps, a dedicated library is better.
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
             Math.floor((367 * (month - 2 - 12 * (Math.floor((month - 14) / 12)))) / 12) -
             Math.floor((3 * (Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100))) / 4) +
             day - 32075;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const i = l - 10631 * n + 354;
    const j = (Math.floor((10985 - i) / 5316)) * (Math.floor((50 * i) / 17719)) +
              (Math.floor(i / 5670)) * (Math.floor((43 * i) / 15238));
    const i2 = i - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
               (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const hMonth = Math.floor(i2 / 29.5305882);
    const hDay = Math.round(i2 - 29.5305882 * (hMonth - 1));
    const hYear = 30 * n + j - 30;

    const hijriMonths = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
    return `${hDay} ${hijriMonths[hMonth - 1]} ${hYear} هـ`;
};
