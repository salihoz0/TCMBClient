/**
 * TCMB (Türkiye Cumhuriyet Merkez Bankası) API Client
 * EVDS (Elektronik Veri Dağıtım Sistemi) Web Servisleri için JavaScript istemcisi
 *
 * @author salihoz0
 * @version 1.0.0
 * @description Bu class TCMB'nin EVDS API'sini kullanarak döviz kurları ve diğer ekonomik verileri çeker
 * @requires axios - HTTP istekleri için axios kütüphanesi gereklidir
 * @requires xml2js - XML verilerini JSON'a dönüştürmek için xml2js kütüphanesi gereklidir
 *
 * KURULUM:
 * npm install axios
 *
 * VEYA CDN ile:
 * <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
 */

const xml2js = require('xml2js');
const axios = require('axios');

class TCMBClient {
    /**
     * TCMB Client Constructor
     * @param {string} apiKey - TCMB EVDS API anahtarı (https://evds2.tcmb.gov.tr/ adresinden alınır)
     * @param {string} baseUrl - API temel URL'si (varsayılan: EVDS API)
     */
    constructor(apiKey, baseUrl = 'https://evds2.tcmb.gov.tr/service/evds') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.xmlBaseUrl = 'https://www.tcmb.gov.tr/kurlar';

        // Seri kodları - Döviz kurları
        this.CURRENCY_CODES = {
            // USD - Amerikan Doları
            USD: { buy: 'TP.DK.USD.A', sell: 'TP.DK.USD.S', name: 'ABD DOLARI' },
            // EUR - Euro
            EUR: { buy: 'TP.DK.EUR.A', sell: 'TP.DK.EUR.S', name: 'EURO' },
            // GBP - İngiliz Sterlini
            GBP: { buy: 'TP.DK.GBP.A', sell: 'TP.DK.GBP.S', name: 'İNGİLİZ STERLİNİ' },
            // CHF - İsviçre Frangı
            CHF: { buy: 'TP.DK.CHF.A', sell: 'TP.DK.CHF.S', name: 'İSVİÇRE FRANGI' },
            // JPY - Japon Yeni
            JPY: { buy: 'TP.DK.JPY.A', sell: 'TP.DK.JPY.S', name: 'JAPON YENİ' },
            // CAD - Kanada Doları
            CAD: { buy: 'TP.DK.CAD.A', sell: 'TP.DK.CAD.S', name: 'KANADA DOLARI' },
            // AUD - Avustralya Doları
            AUD: { buy: 'TP.DK.AUD.A', sell: 'TP.DK.AUD.S', name: 'AVUSTRALYA DOLARI' },
            // SEK - İsveç Kronu
            SEK: { buy: 'TP.DK.SEK.A', sell: 'TP.DK.SEK.S', name: 'İSVEÇ KRONU' },
            // NOK - Norveç Kronu
            NOK: { buy: 'TP.DK.NOK.A', sell: 'TP.DK.NOK.S', name: 'NORVEÇ KRONU' },
            // DKK - Danimarka Kronu
            DKK: { buy: 'TP.DK.DKK.A', sell: 'TP.DK.DKK.S', name: 'DANİMARKA KRONU' },
            // RUB - Rus Rublesi
            RUB: { buy: 'TP.DK.RUB.A', sell: 'TP.DK.RUB.S', name: 'RUS RUBLESİ' },
            // CNY - Çin Yuanı
            CNY: { buy: 'TP.DK.CNY.A', sell: 'TP.DK.CNY.S', name: 'ÇİN YUANI' },
            // SAR - Suudi Arabistan Riyali
            SAR: { buy: 'TP.DK.SAR.A', sell: 'TP.DK.SAR.S', name: 'SUUDİ ARABİSTAN RİYALİ' },
            // KWD - Kuveyt Dinarı
            KWD: { buy: 'TP.DK.KWD.A', sell: 'TP.DK.KWD.S', name: 'KUVEYT DİNARI' },
            // QAR - Katar Riyali
            QAR: { buy: 'TP.DK.QAR.A', sell: 'TP.DK.QAR.S', name: 'KATAR RİYALİ' },
            // IRR - İran Riyali
            IRR: { buy: 'TP.DK.IRR.A', sell: 'TP.DK.IRR.S', name: 'İRAN RİYALİ' },
            // BGN - Bulgar Levası
            BGN: { buy: 'TP.DK.BGN.A', sell: 'TP.DK.BGN.S', name: 'BULGAR LEVASI' },
            // RON - Rumen Leyi
            RON: { buy: 'TP.DK.RON.A', sell: 'TP.DK.RON.S', name: 'RUMEN LEYİ' },
            // PKR - Pakistan Rupisi
            PKR: { buy: 'TP.DK.PKR.A', sell: 'TP.DK.PKR.S', name: 'PAKİSTAN RUPİSİ' },
        };

        // Frekans kodları
        this.FREQUENCY = {
            DAILY: 1, // Günlük
            WORKDAY: 2, // İşgünü
            WEEKLY: 3, // Haftalık
            BIMONTHLY: 4, // Ayda 2 Kez
            MONTHLY: 5, // Aylık
            QUARTERLY: 6, // 3 Aylık
            BIANNUAL: 7, // 6 Aylık
            ANNUAL: 8, // Yıllık
        };

        // Formül kodları
        this.FORMULAS = {
            LEVEL: 0, // Düzey (Ham Veri)
            PERCENT_CHANGE: 1, // Yüzde Değişim
            DIFFERENCE: 2, // Fark
            ANNUAL_PERCENT_CHANGE: 3, // Yıllık Yüzde Değişim
            ANNUAL_DIFFERENCE: 4, // Yıllık Fark
            YEAR_END_PERCENT_CHANGE: 5, // Bir Önceki Yılın Sonuna Göre Yüzde Değişim
            YEAR_END_DIFFERENCE: 6, // Bir Önceki Yılın Sonuna Göre Fark
            MOVING_AVERAGE: 7, // Hareketli Ortalama
            MOVING_SUM: 8, // Hareketli Toplam
        };

        // Gözlem (Aggregation) tipleri
        this.AGGREGATION_TYPES = {
            AVERAGE: 'avg', // Ortalama
            MIN: 'min', // En düşük
            MAX: 'max', // En yüksek
            FIRST: 'first', // Başlangıç
            LAST: 'last', // Bitiş
            SUM: 'sum', // Kümülatif
        };
    }

    /**
     * Tarih formatını TCMB API formatına dönüştürür (dd-MM-yyyy)
     * @param {Date|string} date - Dönüştürülecek tarih
     * @returns {string} TCMB formatında tarih
     */
    formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('Geçersiz tarih formatı');
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    /**
     * Tarih formatını XML URL formatına dönüştürür (ddMMyyyy)
     * @param {Date|string} date - Dönüştürülecek tarih
     * @returns {string} XML URL formatında tarih
     */
    formatDateForXml(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('Geçersiz tarih formatı');
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}${month}${year}`;
    }
    /**
     * HTTP isteği yapar (Axios kullanarak)
     * @param {string} url - İstek URL'si
     * @returns {Promise<Object>} API yanıtı
     */
    async makeRequest(url, useApiKey = true) {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                headers: useApiKey
                    ? {
                          key: this.apiKey,
                          'Content-Type': 'application/json',
                      }
                    : {},
                timeout: 30000, // 30 saniye timeout
                validateStatus: function (status) {
                    return status < 500; // 500'den küçük statusları reject etme
                },
            });

            if (response.status === 403) {
                throw new Error(
                    'API anahtarı geçersiz veya eksik. Lütfen API anahtarınızı kontrol edin.'
                );
            }

            if (response.status >= 400) {
                throw new Error(`HTTP Hatası: ${response.status} - ${response.statusText}`);
            }

            return response.data;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.');
            }
            if (error.response) {
                throw new Error(
                    `API Hatası: ${error.response.status} - ${error.response.statusText}`
                );
            }
            if (error.request) {
                throw new Error('Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.');
            }
            throw new Error(`API isteği başarısız: ${error.message}`);
        }
    }
    /**
     * XML string'ini parse eder
     * @param {string} xmlString - XML verisi
     * @returns {Object} Parse edilmiş XML objesi
     */
    async parseXml(xmlString) {
        const parser = new xml2js.Parser({ explicitArray: false });
        try {
            const result = await parser.parseStringPromise(xmlString);
            return result;
        } catch (err) {
            throw new Error('XML parsing error: ' + err.message);
        }
    }

    /**
     * URL oluşturur
     * @param {Object} params - URL parametreleri
     * @returns {string} Oluşturulan URL
     */
    buildUrl(params) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });

        return `${this.baseUrl}/${queryParams.toString()}`;
    }
    /**
     * XML API URL'si oluşturur
     * @param {Date|string} date - Tarih
     * @returns {string} XML API URL'si
     */
    buildXmlUrl(date) {
        const formattedDate = this.formatDateForXml(date);
        const year = new Date(date).getFullYear();
        const month = String(new Date(date).getMonth() + 1).padStart(2, '0');

        return `${this.xmlBaseUrl}/${year}${month}/${formattedDate}.xml`;
    }

    /**
     * Belirli bir tarihteki döviz kurlarını getirir
     * @param {Date|string} date - Tarih (varsayılan: bugün)
     * @param {Array<string>} currencies - İstenen para birimleri (varsayılan: tümü)
     * @param {boolean} includeBoth - Alış ve satış kurlarını dahil et (varsayılan: true)
     * @returns {Promise<Object>} Kur bilgileri
     */
    async getExchangeRatesForDate(date = new Date(), currencies = null, includeBoth = true) {
        const formattedDate = this.formatDate(date);
        const targetCurrencies = currencies || Object.keys(this.CURRENCY_CODES);

        // Seri kodlarını hazırla
        const seriesCodes = [];
        targetCurrencies.forEach((currency) => {
            if (this.CURRENCY_CODES[currency]) {
                if (includeBoth) {
                    seriesCodes.push(this.CURRENCY_CODES[currency].buy);
                    seriesCodes.push(this.CURRENCY_CODES[currency].sell);
                } else {
                    seriesCodes.push(this.CURRENCY_CODES[currency].buy);
                }
            }
        });

        const url = this.buildUrl({
            series: seriesCodes.join('-'),
            startDate: formattedDate,
            endDate: formattedDate,
            type: 'json',
        });

        const data = await this.makeRequest(url);
        return this.parseExchangeRateData(data, targetCurrencies, formattedDate);
    }
    /**
     * Belirli bir tarihteki TCMB gösterge kurlarını XML API'den getirir (API key gerektirmez)
     * @param {Date|string} date - Tarih (varsayılan: bugün)
     * @param {Array<string>} currencies - İstenen para birimleri (varsayılan: tümü)
     * @param {boolean} includeBoth - Alış ve satış kurlarını dahil et (varsayılan: true)
     * @returns {Promise<Object>} TCMB gösterge kur bilgileri
     */
    async getIndicativeRates(date = new Date(), currencies = null, includeBoth = true) {
        const targetCurrencies = currencies || Object.keys(this.CURRENCY_CODES);
        const xmlUrl = this.buildXmlUrl(date);
        const formattedDate = this.formatDate(date);

        try {
            const xmlData = await this.makeRequest(xmlUrl, false);
            const xmlDoc = await this.parseXml(xmlData);

            return this.parseXmlExchangeRateData(
                xmlDoc,
                targetCurrencies,
                formattedDate,
                includeBoth
            );
        } catch (error) {
            throw new Error(
                `TCMB gösterge kurları alınamadı: ${error.message}. Hafta sonu, tatil günü veya gelecek tarih olabilir.`
            );
        }
    }

    /**
     * XML döviz kuru verisini ayrıştırır
     * @param {Document} xmlDoc - XML dokümanı
     * @param {Array<string>} currencies - İstenen para birimleri
     * @param {string} date - Tarih
     * @param {boolean} includeBoth - Alış ve satış kurlarını dahil et
     * @returns {Object} Ayrıştırılmış veri
     */
    parseXmlExchangeRateData(xmlObj, currencies, date, includeBoth) {
        const result = {
            date: date,
            rates: {},
            totalCurrencies: currencies.length,
            source: 'TCMB Gösterge Kurları',
        };

        // Hata kontrolü (xml2js parse hatası objede farklı olabilir, genelde try-catch ile yapılır)
        // Burada varsayılan olarak xmlObj yapısını kontrol edelim
        if (!xmlObj || !xmlObj.Tarih_Date || !xmlObj.Tarih_Date.Currency) {
            result.error = 'Bu tarih için veri bulunamadı. Hafta sonu veya tatil günü olabilir.';
            return result;
        }

        // Currency verileri dizi veya tekil olabilir
        const currencyArray = Array.isArray(xmlObj.Tarih_Date.Currency)
            ? xmlObj.Tarih_Date.Currency
            : [xmlObj.Tarih_Date.Currency];

        // xmlCurrencies objesini oluştur
        const xmlCurrencies = {};
        currencyArray.forEach((currencyEl) => {
            // Kod attribute $ altında
            const code = currencyEl.$?.Kod || currencyEl.$?.CurrencyCode;

            if (code) {
                // Elemanlar direkt property olarak varsa al, yoksa boş string
                const unit = currencyEl.Unit || '1';
                const forexBuying = currencyEl.ForexBuying || null;
                const forexSelling = currencyEl.ForexSelling || null;
                const name = currencyEl.Isim || '';

                xmlCurrencies[code] = {
                    unit: parseFloat(unit) || 1,
                    buy: forexBuying ? parseFloat(forexBuying) : null,
                    sell: forexSelling ? parseFloat(forexSelling) : null,
                    name: name,
                };
            }
        });

        currencies.forEach((currency) => {
            if (this.CURRENCY_CODES[currency] && xmlCurrencies[currency]) {
                const xmlCurrency = xmlCurrencies[currency];
                let buyRate = xmlCurrency.buy;
                let sellRate = xmlCurrency.sell;

                // JPY için 100 birim bazında verilmişse direkt kullan
                if (currency === 'JPY' && xmlCurrency.unit === 100) {
                    // Değişiklik yok
                } else if (xmlCurrency.unit > 1) {
                    // Birim başına düşür
                    if (buyRate) buyRate = buyRate / xmlCurrency.unit;
                    if (sellRate) sellRate = sellRate / xmlCurrency.unit;
                }

                result.rates[currency] = {
                    name: this.CURRENCY_CODES[currency].name,
                    code: currency,
                    buy: buyRate,
                    sell: includeBoth ? sellRate : undefined,
                };

                if (!includeBoth) {
                    delete result.rates[currency].sell;
                }
            }
        });

        return result;
    }

    /**
     * XML elementinden text içeriği alır
     * @param {Element} parentElement - Ana element
     * @param {string} tagName - Tag adı
     * @returns {string|null} Text içeriği
     */
    getXmlElementText(parentElement, tagName) {
        const elements = parentElement.getElementsByTagName(tagName);
        if (elements.length > 0 && elements[0].textContent) {
            return elements[0].textContent.trim();
        }
        return null;
    }

    /**
     * Belirli bir para biriminin belirli tarih aralığındaki kurlarını getirir
     * @param {string} currency - Para birimi kodu (örn: 'USD')
     * @param {Date|string} startDate - Başlangıç tarihi
     * @param {Date|string} endDate - Bitiş tarihi
     * @param {boolean} includeBoth - Alış ve satış kurlarını dahil et
     * @returns {Promise<Object>} Geçmiş kur verileri
     */
    async getHistoricalRates(currency, startDate, endDate, includeBoth = true) {
        if (!this.CURRENCY_CODES[currency]) {
            throw new Error(`Desteklenmeyen para birimi: ${currency}`);
        }

        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate);

        const seriesCodes = includeBoth
            ? [this.CURRENCY_CODES[currency].buy, this.CURRENCY_CODES[currency].sell]
            : [this.CURRENCY_CODES[currency].buy];

        const url = this.buildUrl({
            series: seriesCodes.join('-'),
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            type: 'json',
        });

        const data = await this.makeRequest(url);
        return this.parseHistoricalData(data, currency);
    }

    /**
     * Tek bir para biriminin tek kurunu (alış veya satış) getirir
     * @param {string} currency - Para birimi kodu
     * @param {Date|string} date - Tarih
     * @param {string} type - Kur tipi ('buy' veya 'sell')
     * @returns {Promise<Object>} Kur bilgisi ve meta verileri
     */
    async getSingleRate(currency, date = new Date(), type = 'buy') {
        if (!this.CURRENCY_CODES[currency]) {
            throw new Error(`Desteklenmeyen para birimi: ${currency}`);
        }

        if (!['buy', 'sell'].includes(type)) {
            throw new Error("Kur tipi 'buy' veya 'sell' olmalıdır");
        }

        const formattedDate = this.formatDate(date);
        const seriesCode = this.CURRENCY_CODES[currency][type];

        const url = this.buildUrl({
            series: seriesCode,
            startDate: formattedDate,
            endDate: formattedDate,
            type: 'json',
        });

        const data = await this.makeRequest(url);

        // Seri bilgilerini de al
        const seriesInfo = await this.getSeriesInfo(seriesCode);
        return this.parseSingleRateData(data, currency, type, seriesInfo, formattedDate);
    }

    /**
     * Seri hakkında meta bilgileri getirir (Axios kullanarak)
     * @param {string} seriesCode - Seri kodu
     * @returns {Promise<Object>} Seri bilgileri
     */
    async getSeriesInfo(seriesCode) {
        const url = `${this.baseUrl}/serieList/type=json&code=${seriesCode}`;

        try {
            const response = await axios({
                method: 'GET',
                url: url,
                headers: {
                    key: this.apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 15000, // 15 saniye timeout
                validateStatus: function (status) {
                    return status < 500;
                },
            });

            if (response.status >= 400) {
                return null; // Seri bilgisi alınamazsa null döner
            }

            return response.data;
        } catch (error) {
            console.warn('Seri bilgisi alınamadı:', error.message);
            return null;
        }
    }

    /**
     * Döviz kuru verisini ayrıştırır
     * @param {Object} data - API'den gelen ham veri
     * @param {Array<string>} currencies - İstenen para birimleri
     * @param {string} date - Tarih
     * @returns {Object} Ayrıştırılmış veri
     */
    parseExchangeRateData(data, currencies, date) {
        const result = {
            date: date,
            rates: {},
            totalCurrencies: currencies.length,
        };
        if (!data.items || data.items.length === 0) {
            result.error = 'Bu tarih için veri bulunamadı. Hafta sonu veya tatil günü olabilir.';
            return result;
        }

        const item = data.items.find((item) => item.Tarih === date);

        currencies.forEach((currency) => {
            if (this.CURRENCY_CODES[currency]) {
                const buyCode = this.CURRENCY_CODES[currency].buy.replace(/\./g, '_');
                const sellCode = this.CURRENCY_CODES[currency].sell.replace(/\./g, '_');
                const buyValue = item && item[buyCode] ? parseFloat(item[buyCode]) : null;
                const sellValue = item && item[sellCode] ? parseFloat(item[sellCode]) : null;

                result.rates[currency] = {
                    name: this.CURRENCY_CODES[currency].name,
                    code: currency,
                    buy: buyValue,
                    sell: sellValue,
                };
            }
        });

        return result;
    }

    /**
     * Geçmiş veri ayrıştırır
     * @param {Object} data - API'den gelen ham veri
     * @param {string} currency - Para birimi
     * @returns {Object} Ayrıştırılmış geçmiş veri
     */
    parseHistoricalData(data, currency) {
        const result = {
            currency: currency,
            currencyName: this.CURRENCY_CODES[currency]?.name || '',
            rates: [],
            totalRecords: 0,
        };

        if (!data.items || data.items.length === 0) {
            result.error = 'Bu tarih aralığı için veri bulunamadı.';
            return result;
        }

        const ratesByDate = {};

        data.items.forEach((item) => {
            const date = item.Tarih; // 'DD-MM-YYYY'
            if (!ratesByDate[date]) {
                ratesByDate[date] = { date };
            }

            // Alım ve Satış alanlarını bul
            Object.keys(item).forEach((key) => {
                if (key === 'Tarih' || key === 'UNIXTIME') return; // Atla

                const value = item[key];
                if (value === null) return; // Null ise atla

                const parsedValue = parseFloat(value);
                if (isNaN(parsedValue)) return;

                if (key.endsWith('_A')) {
                    ratesByDate[date].buy = parsedValue;
                } else if (key.endsWith('_S')) {
                    ratesByDate[date].sell = parsedValue;
                }
            });
        });

        // Tarihe göre sıralama: 'DD-MM-YYYY' => 'YYYY-MM-DD'
        result.rates = Object.values(ratesByDate).sort((a, b) => {
            const dateA = a.date.split('-').reverse().join('-'); // 'YYYY-MM-DD'
            const dateB = b.date.split('-').reverse().join('-');
            return new Date(dateA) - new Date(dateB);
        });

        result.totalRecords = result.rates.length;
        return result;
    }

    /**
     * Tek kur verisini ayrıştırır
     * @param {Object} data - API'den gelen ham veri
     * @param {string} currency - Para birimi
     * @param {string} type - Kur tipi
     * @param {Object} seriesInfo - Seri meta verileri
     * @param {string} date - Tarih
     * @returns {Object} Ayrıştırılmış tek kur verisi
     */
    parseSingleRateData(data, currency, type, seriesInfo, date) {
        const result = {
            currency: currency,
            currencyName: this.CURRENCY_CODES[currency].name,
            type: type,
            typeName: type === 'buy' ? 'Alış' : 'Satış',
            date: date,
            rate: null,
            seriesInfo: null,
        };

        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const valueField = Object.keys(item).find(
                (key) => key !== 'Tarih' && key !== 'SERIE_CODE' && item[key] !== null
            );

            if (valueField) {
                result.rate = parseFloat(item[valueField]);
            }
        }

        if (seriesInfo && seriesInfo && seriesInfo.length > 0) {
            const info = seriesInfo[0];
            result.seriesInfo = {
                seriesCode: info.SERIE_CODE,
                seriesName: info.SERIE_NAME,
                seriesNameEng: info.SERIE_NAME_ENG,
                frequency: info.FREQUENCY_STR,
                dataSource: info.DATASOURCE,
                startDate: info.START_DATE,
                endDate: info.END_DATE,
            };
        }

        if (!result.rate) {
            result.error = 'Bu tarih için veri bulunamadı. Hafta sonu veya tatil günü olabilir.';
        }

        return result;
    }

    /**
     * Mevcut para birimlerini listeler
     * @returns {Array<Object>} Para birimi listesi
     */
    getSupportedCurrencies() {
        return Object.entries(this.CURRENCY_CODES).map(([code, info]) => ({
            code: code,
            name: info.name,
            buyCode: info.buy,
            sellCode: info.sell,
        }));
    }

    /**
     * API bağlantısını test eder
     * @returns {Promise<boolean>} Bağlantı durumu
     */
    async testConnection() {
        try {
            // Basit bir test isteği - USD kuru
            await this.getSingleRate('USD', new Date());
            return true;
        } catch (error) {
            console.error('TCMB API bağlantı testi başarısız:', error.message);
            return false;
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TCMBClient;
}

// Export for ES6 modules
if (typeof window === 'undefined') {
    // Node.js environment
    global.TCMBClient = TCMBClient;
} else {
    // Browser environment
    window.TCMBClient = TCMBClient;
}

/* 
KURULUM VE KULLANIM ÖRNEKLERİ:
===============================

## KURULUM:

### Node.js için:
npm install axios

### Browser için:
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="tcmb-client.js"></script>

## KULLANIM ÖRNEKLERİ:
======================

// 1. Client oluşturma
const client = new TCMBClient('YOUR_API_KEY');

// 2. Bugünkü tüm kurları alma
client.getExchangeRatesForDate()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// 3. Belirli bir tarihteki USD ve EUR kurları
client.getExchangeRatesForDate(new Date('2024-01-15'), ['USD', 'EUR'])
    .then(data => console.log(data))
    .catch(error => console.error(error));

// 4. USD'nin geçmiş kurları (son 30 gün)
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);

client.getHistoricalRates('USD', startDate, endDate)
    .then(data => console.log(data))
    .catch(error => console.error(error));

// 5. Tek bir kur (USD alış kuru) - Meta verilerle birlikte
client.getSingleRate('USD', new Date(), 'buy')
    .then(data => {
        console.log('Kur:', data.rate);
        console.log('Seri Bilgileri:', data.seriesInfo);
    })
    .catch(error => console.error(error));

// 6. Desteklenen para birimlerini listele
console.log(client.getSupportedCurrencies());

// 7. API bağlantısını test et
client.testConnection()
    .then(isConnected => console.log('API bağlantısı:', isConnected ? 'Başarılı' : 'Başarısız'))
    .catch(error => console.error(error));

// 8. Async/await kullanımı
async function getDollarRate() {
    try {
        const data = await client.getSingleRate('USD', new Date(), 'buy');
        console.log(`USD Alış Kuru: ${data.rate} TL`);
        if (data.seriesInfo) {
            console.log(`Veri Kaynağı: ${data.seriesInfo.dataSource}`);
            console.log(`Son Güncelleme: ${data.seriesInfo.endDate}`);
        }
    } catch (error) {
        console.error('Hata:', error.message);
    }
}

getDollarRate();

## HATA YÖNETİMİ:
=================

Axios kullanımı ile gelişmiş hata yönetimi:
- Timeout hataları (30 saniye)
- Ağ bağlantısı hataları
- API anahtar doğrulama hataları
- HTTP status kod kontrolleri
- Detaylı hata mesajları
*/
