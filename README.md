## اسکریپت ورکر برای ایجاد لینک کلش

محتوای فایل اسکریپت را از مسیر dist دانلود کرده و در ورکر خود کپی کنید.
ویدیو آموزشی را می‌توانید از لینک‌های زیر مشاهده کنید:

### یوتیوب

[آموزش راه‌اندازی و فعال کردن کد ورکر کلش](https://youtu.be/8lRo7diMkbk)

### تلگرام

[توضیحات در کانال تلگرام](https://t.me/vahidgeek/124)


نمونه‌ی مسیرهایی که بعد از ساخت ورکر باید در بخش کانفیگ اپ کلش وارد کنید به شکل زیر می‌باشد. در این حالت بدون نیاز به آی‌پی تمیز، یک دامین اتفاقی از لیست دامین‌های تمیز انتخاب شده و روی برخی اوپراتورها با کیفیت قابل قبول پاسخ خواهد داد:

https://my-worker.my-id.workers.dev/clash


میتوانید در ادامه، کد سه حرفی اوپراتور را وارد کنید تا آی‌پی تمیز اوپراتور مربوطه به کانفیگ شما اضافه شود. برای مثال، همراه اول:

https://my-worker.my-id.workers.dev/clash/mci


لیست کدهای سه حرفی اوپراتورها به شرح زیر است:

کد سه‌حرفی  |    اوپراتور      
---         | --- 
afn         | افرانت       
apt         | عصر تلکام    
ast         | آسیاتک       
dbn         | دیده‌بان     
dtk         | داتک    
fnv         | فن‌آوا        
hwb         | های‌وب        
mbt         | مبین‌نت       
mci         | همراه اول    
mkh         | مخابرات      
mtn         | ایرانسل      
prs         | پارس‌آنلاین    
psm         | پیشگامان    
rsp         | رسپینا       
rtl         | رایتل        
sht         | شاتل         
ztl         | زیتل
---         | ---


و یا لینک کلش را همراه آی‌پی تمیز در اپ خود اضافه کنید:

https://my-worker.my-id.workers.dev/clash/1.2.3.4

می‌توانید چند آی‌پی تمیز را با کاما جدا کنید. در این صورت برای هر آی‌پی تمیز به تعداد قید شده، کانفیک ترکیب شده با ورکر تحویل می دهد:

https://my-worker.my-id.workers.dev/clash/1.2.3.4,9.8.7.6

دقیقا با همین مدل می‌توانید دامین آی‌پی تمیز نیز استفاده کنید:

https://my-worker.my-id.workers.dev/clash/mci.ircf.space

می‌توانید از چند سابدامنین آیءی تمیز نیز استفاده کنید:

https://my-worker.my-id.workers.dev/clash/mci.ircf.space,my.domain.me

می‌توانید با متغیر max تعداد کانفیگ را مشخص کنید:

https://my-worker.my-id.workers.dev/clash?max=200

همچنین می‌توانید با متغیر original با عدد 0 یا 1 و یا با yes/no مشخص کنید که کانفیگ‌های اصلی (ترکیب نشده با ورکر) هم در خروجی آورده شوند یا نه:

https://my-worker.my-id.workers.dev/clash/1.2.3.4?max=200&original=yes

https://my-worker.my-id.workers.dev/clash?max=200&original=0

در صورت لزوم می توانید با متغیر merge مشخص کنید که کانفیگ‌های ترکیبی حذف شوند:

https://my-worker.my-id.workers.dev/clash?max=200&original=yes&merge=no

در صورت نیاز می‌توانید برای کانفیگ‌های اصلی، تعیین کنید که کدام نوع از کانفیگ‌ها را برای شما لیست کند:

https://my-worker.my-id.workers.dev/clash?max=200&type=vmess,ss,ssr

همچنین در صورت نیاز می‌توانید لیست پرووایدرها را محدود کنید:

https://my-worker.my-id.workers.dev/clash?provider=mahdibland,mfuu

لیست پرووایدرهای قابل قبول:

ردیف | fp
---  | ---
 1   | [mahdibland](https://github.com/mahdibland/SSAggregator)
 3   | [mfuu](https://github.com/mfuu/v2ray)
 4   | [peasoft](https://github.com/peasoft/NoMoreWalls)
 5   | [getnode](https://github.com/a2470982985/getNode)
 6   | [nodefree](https://github.com/mlabalabala/v2ray-node)
 7   | [clashnode](https://github.com/mlabalabala/v2ray-node)
---  | ---
