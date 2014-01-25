(function (window, document) {

/*    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }*/
	$('#menuLink').on('touchend',function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#layout, #menu, #menulink').toggleClass('active');
/*		if($('#layout').hasClass('active')){
			var pagenavigator = document.getElementById("pagenavigator");
			pagenavigator.removeEventListener("touchstart",touchDownHandle);
		}else {
			var pagenavigator = document.getElementById("pagenavigator");
			pagenavigator.addEventListener("touchstart",touchDownHandle,false);
		}*/
    });
  /*  menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };*/

}(this, this.document));
