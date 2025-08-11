# TCMBClient

[![npm version](https://img.shields.io/npm/v/tcmb-client?color=blue&style=flat-square)](https://www.npmjs.com/package/tcmb-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Türkiye Cumhuriyet Merkez Bankası (TCMB) Elektronik Veri Dağıtım Sistemi (EVDS) API'sine kolay ve modern erişim sağlayan JavaScript istemcisi.

---

## API Anahtarı (Key) Hakkında

**API Anahtarı (key=XXXXXXX) her kullanıcı için farklıdır ve TCMB EVDS sistemine üye olarak alınır.**

API anahtarını almak için:

1. [https://evds2.tcmb.gov.tr/](https://evds2.tcmb.gov.tr/) adresine gidin.
2. Üye ekranından sisteme giriş yapın.
3. Sağ üst köşedeki kullanıcı isminize tıklayın.
4. Açılan menüden **Profil** seçeneğini seçin.
5. Gelen ekranda **API Anahtarı** düğmesine tıklayarak kişisel anahtarınızı görüntüleyebilirsiniz.

---

## Kurulum

### Node.js ortamı için

```bash
npm install axios
npm install tcmb-client
```

veya sadece axios yüklü ise kendi `tcmb-client.js` dosyanızı projenize dahil edebilirsiniz.

---

## Kullanım Örneği

```js
// TCMBClient sınıfını projenize dahil edin (Node.js için)
// const TCMBClient = require('tcmb-client');

// 1. İstemci oluşturma (API anahtarınızı girin)
const client = new TCMBClient('YOUR_API_KEY_HERE');

// 2. Bugünkü tüm döviz kurlarını alma
client
    .getExchangeRatesForDate()
    .then((data) => console.log('Bugünkü Kurlar:', data))
    .catch((err) => console.error('Hata:', err.message));

// 3. Belirli bir tarih ve para birimleri ile döviz kurları alma
client
    .getExchangeRatesForDate(new Date('2024-01-15'), ['USD', 'EUR'])
    .then((data) => console.log('Belirli Tarih Kurları:', data))
    .catch((err) => console.error('Hata:', err.message));

// 4. USD para biriminin son 30 güne ait geçmiş kurlarını alma
const endDate = new Date();
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30);

client
    .getHistoricalRates('USD', startDate, endDate)
    .then((data) => console.log('USD Geçmiş Kurları:', data))
    .catch((err) => console.error('Hata:', err.message));

// 5. Tek bir kur (USD alış kuru) - Meta veriler ile birlikte alma
client
    .getSingleRate('USD', new Date(), 'buy')
    .then((data) => {
        console.log('USD Alış Kuru:', data.rate);
        if (data.seriesInfo) {
            console.log('Seri Bilgileri:', data.seriesInfo);
        }
    })
    .catch((err) => console.error('Hata:', err.message));

// 6. Desteklenen para birimlerini listeleme
console.log('Desteklenen Para Birimleri:', client.getSupportedCurrencies());

// 7. API bağlantısını test etme
client
    .testConnection()
    .then((isConnected) => console.log('API Bağlantısı:', isConnected ? 'Başarılı' : 'Başarısız'))
    .catch((err) => console.error('Hata:', err.message));
```

---

## Fonksiyonlar

| Fonksiyon                      | Açıklama                                          |
| ------------------------------ | ------------------------------------------------- |
| `constructor(apiKey, baseUrl)` | API anahtarı ile istemci oluşturur                |
| `getExchangeRatesForDate(...)` | Belirli tarih için döviz kurlarını getirir        |
| `getHistoricalRates(...)`      | Belirli para birimi için tarih aralığında kurlar  |
| `getSingleRate(...)`           | Tek para birimi ve türü için (alış/satış) tek kur |
| `getSupportedCurrencies()`     | Desteklenen para birimlerinin listesini döner     |
| `testConnection()`             | API bağlantısını test eder                        |

---

## Hata Yönetimi

-   API anahtarı geçersiz veya eksikse hata fırlatır
-   Ağ bağlantı sorunları ve zaman aşımı durumlarını yakalar
-   HTTP durum kodlarına göre detaylı ve anlaşılır hata mesajları döner

---

## Sorumluluk Reddi (Disclaimer)

Bu kütüphane, Türkiye Cumhuriyet Merkez Bankası (TCMB) EVDS sisteminden alınan verilere dayanmaktadır. Bu kütüphaneyi kullananlar, verilerin doğruluğunu kendi sorumlulukları altında değerlendirmeli ve kararlarını buna göre vermelidir. Yazar ve proje geliştiricileri, veri doğruluğu veya kullanımı ile ilgili herhangi bir sorumluluk kabul etmez.

---

## Lisans

MIT License © 2025 salihoz0

---

## İletişim ve Katkı

Her türlü öneri ve hata bildirimi için GitHub reposundaki [Issues](https://github.com/salihoz0/tcmb-client/issues) bölümünü kullanabilirsiniz.

---

**TCMB EVDS API'si için güvenilir ve kolay kullanılabilir JavaScript istemcisi.**
