(function () {
    var summaries = document.getElementsByTagName('summary'),
        summaryLength = summaries.length;

    for (var i = 0; i < summaryLength; i++) {
        summaries[i].onclick = function () {
            var dl = this.parentNode.getElementsByTagName('dl')[0];
            if (dl) dl.style.maxHeight = dl.style.maxHeight != '20em' ? '20em' : '0';
        };
    }

    var textarea = document.getElementById('message');
    if (textarea) document.getElementById('send-message').onclick = function () {
		if(!textarea.value.length || textarea.value.length < 50)
		{
		    alert('Too short message. Please type a real message. If possible include your email too. Thanks.');
		    textarea.focus();
			return;
		}

		this.disabled = true;
		
        var element = this;
        element.style.color = 'gray';
        element.innerHTML = 'Sending...';

        window.messenger && messenger.deliver(textarea.value, function () {
            element.style.color = '#1B75C9';
            textarea.value = '';
            element.innerHTML = 'Send Message';
            element.disabled = false;

            alert('Your message has been sent successfully. Thanks');
        });
    };

    /* Google +1 button */
    var po = document.createElement('script');
    po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

setTimeout(function () {
    var script = document.createElement('script');
    script.src = 'https://webrtc-experiment.appspot.com/dependencies/messenger.js';
    document.body.appendChild(script);
}, 3000);

(function () {
    var iframe = document.createElement('iframe');
	iframe.className = 'visible';
    iframe.src = 'https://webrtc-experiment.appspot.com/demos/menu.html';
	iframe.setAttribute('style', 'border:1px solid rgb(189, 189, 189);margin:.2em .5em;border-radius:.2em;height:3em;width:98%;');
    document.body.appendChild(iframe);
})();
