# Secure Cloud Blog API
Bu proje, Node.js ve Express kullanılarak geliştirilmiş basit bir mini blog API’sidir.  
Kullanıcı girişi yapıldıktan sonra post ekleme ve postları listeleme işlemleri yapılabilmektedir.
---

## Özellikler
- JWT ile kullanıcı girişi (login)
- Post ekleme ve post listeleme
- Bellek içi (in-memory) veri kullanımı
- Posts endpoint’i için cache kullanımı
- Cache süresi dolunca otomatik temizleme (TTL)
- Yeni post eklenince cache temizlenir
- Port çakışmalarına karşı otomatik port seçimi
- Basit bir web arayüzü ile test edilebilir
---

## Kullanılan Teknolojiler
- Node.js
- Express.js
- JWT (JSON Web Token)
- HTML ve JavaScript
- In-memory cache (Map)
---

## Proje Yapısı
src/
├─ controllers/
├─ routes/
├─ middleware/
├─ services/
├─ data/
├─ config/
├─ app.js
└─ server.js

## Kısa Açıklama
Bu projede:
Auth işlemleri JWT ile yapıldı
Logout sonrası token’lar Redis’te blacklist’e alındı
Post endpoint’lerinde Redis cache kullanıldı
Cache ve auth işlemleri service ve middleware yapılarıyla ayrıldı
Amaç, Redis ve JWT kullanımını uygulamalı olarak öğrenmek ve
basit ama gerçekçi bir backend mimarisi kurmaktı.

> Not: Proje dosya tabanlı veri (JSON) kullandığı için local ve production ortamları birbirinden bağımsız çalışmaktadır. 
Bu nedenle localde oluşturulan kullanıcılar ve postlar, sunucu üzerindeki verilerle ortak değildir. 
Proje AWS üzerinde bir sunucu ortamında çalıştırılarak test edilmiştir.

