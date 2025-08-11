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

Not: getIndicativeRates fonksiyonu TCMB'nin sunduğu gösterge kurlarını API anahtarı gerektirmeden alır. Diğer tüm fonksiyonlar için API anahtarı zorunludur.

---

## Kurulum

### Node.js ortamı için

```bash
npm install tcmb-client
```

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

// 8. Gösterge kurlarını alma (yeni eklenen fonksiyon)
client
    .getIndicativeRates()
    .then((data) => console.log('Gösterge Kurları:', data))
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
| `getIndicativeRates()`         | TCMB'nin yayınladığı gösterge kurlarını alır      |

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

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRAaNTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**TCMB EVDS API'si için güvenilir ve kolay kullanılabilir JavaScript istemcisi.**
