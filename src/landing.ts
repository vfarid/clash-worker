export function landingPage(url: URL): Response {
	return new Response(
`
<!DOCTYPE html>
<body dir="rtl">
	<h3>
		<font color="green">همه چی درسته</font>
	</h3>
	<p></p>
	<p>
		این لینک sub را در اپ v2ray خود به شکل زیر کپی کنید. در این صورت یک دامین اتفاقی از خود ورکر به عنوان آی‌پی تمیز انتخاب شده و روی بیشتر اوپراتورها با کیفیت خوب پاسخ خواهد داد:
	</p>
	<p>
		<a href="https://${url.hostname}/clash">https://${url.hostname}/clash</a>
	</p>
	<p>
		این لینک clash را همراه با کد اپراتور در اپ v2ray خود کپی کنید. برای مثال در همراه اول به شکل زیر خواهد بود:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/mci">https://${url.hostname}/clash/mci</a>
	</p>
	<p>
		و یا همین لینک را همراه آی‌پی تمیز در اپ خود اضافه کنید:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/1.2.3.4">https://${url.hostname}/clash/1.2.3.4</a>
	</p>
	<p>
		می‌توانید چند آی‌پی تمیز را با کاما جدا کنید. در این صورت برای هر آی‌پی تمیز به تعداد قدید شده، کانفیک ترکیب شده با ورکر تحویل می دهد:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/1.2.3.4,9.8.7.6">https://${url.hostname}/clash/1.2.3.4,9.8.7.6</a>
	</p>
	<p>
		دقیقا با همین مدل می‌توانید دامین آی‌پی تمیز نیز استفاده کنید:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/mci.ircf.space">https://${url.hostname}/clash/mci.ircf.space</a>
	</p>
	<p>
		می‌توانید از چند سابدامنین آیءی تمیز نیز استفاده کنید:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/mci.ircf.space,my.domain.me">https://${url.hostname}/clash/mci.ircf.space,my.domain.me</a>
	</p>
	<p>
		می‌توانید با متغیر max تعداد کانفیگ را مشخص کنید:
	</p>
	<p>
		<a href="https://${url.hostname}/clash?max=200">https://${url.hostname}/clash?max=200</a>
	</p>
	<p>
		همچنین می‌توانید با متغیر original با عدد 0 یا 1 و یا با yes/no مشخص کنید که کانفیگ‌های اصلی (ترکیب نشده با ورکر) هم در خروجی آورده شوند یا نه:
	</p>
	<p>
		<a href="https://${url.hostname}/clash/1.2.3.4?max=200&original=yes">https://${url.hostname}/clash/1.2.3.4?max=200&original=yes</a>
	</p>
	<p>
		<a href="https://${url.hostname}/clash?max=200&original=0">https://${url.hostname}/clash?max=200&original=0</a>
	</p>
	<p>
		در صورت لزوم می توانید با متغیر merge مشخص کنید که کانفیگ‌های ترکیبی حذف شوند:
	</p>
	<p>
		<a href="https://${url.hostname}/clash?max=200&original=yes&merge=no">https://${url.hostname}/clash?max=200&original=yes&merge=no</a>
	</p>
	<p>
		در صورت نیاز می‌توانید برای کانفیگ‌های اصلی، تعیین کنید که کدام نوع از کانفیگ‌ها را برای شما لیست کند:
	</p>
	<p>
		<a href="https://${url.hostname}/clash?max=200&type=vmess,ss,ssr,vless">https://${url.hostname}/clash?max=200&type=vmess,ss,ssr,vless</a>
	</p>
	<p>
		در صورت نیاز می‌توانید لیست پرووایدرها را محدود کنید:
	</p>
	<p>
		<a href="https://${url.hostname}/clash?provider=mahdibland,mfuu">https://${url.hostname}/clash?provider=mahdibland,mfuu</a>
	</p>
</body>
`,  {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	})
}
