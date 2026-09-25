jQuery(document).ready(function($) {
  "use strict";

  function showContactSuccess() {
    var popup = document.getElementById('contact-success-popup');

    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'contact-success-popup';
      popup.className = 'contact-success-popup';
      popup.setAttribute('aria-hidden', 'true');
      popup.innerHTML = '<div class="contact-success-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-success-title" aria-describedby="contact-success-description" tabindex="-1">' +
        '<button class="contact-success-close" type="button" aria-label="Close confirmation">&times;</button>' +
        '<div class="contact-success-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="m14 24 7 7 14-15" /></svg></div>' +
        '<p class="contact-success-eyebrow">Message delivered</p>' +
        '<h2 id="contact-success-title">Thank you for reaching out</h2>' +
        '<p id="contact-success-description">Your message is on its way. I’ll get back to you as soon as I can.</p>' +
        '<button class="contact-success-done" type="button">Done</button>' +
        '</div>';
      document.body.appendChild(popup);

      $(popup).on('click', '.contact-success-close, .contact-success-done', closeContactSuccess);
      $(popup).on('click', function(event) {
        if (event.target === popup) closeContactSuccess();
      });
    }

    popup.returnFocus = document.activeElement;
    popup.setAttribute('aria-hidden', 'false');
    popup.classList.add('is-visible');
    popup.querySelector('.contact-success-dialog').focus();

    function closeContactSuccess() {
      popup.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
      $(document).off('keydown.contactSuccess');
      if (popup.returnFocus && typeof popup.returnFocus.focus === 'function') popup.returnFocus.focus();
    }

    $(document).off('keydown.contactSuccess').on('keydown.contactSuccess', function(event) {
      if (event.key === 'Escape' && popup.classList.contains('is-visible')) {
        closeContactSuccess();
      }
    });
  }

  //Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    if (window.location.protocol === 'file:') {
      $("#sendmessage").removeClass("show");
      $("#errormessage").addClass("show").html('Please open this portfolio through its GitHub Pages URL or a local web server before sending.');
      return false;
    }
    var str = $(this).serialize();
    var action = $(this).attr('action');
    if( ! action ) {
      action = 'contactform/contactform.php';
    }
    $.ajax({
      type: "POST",
      url: action,
      data: str,
      success: function(msg) {
        var response = msg;
        if (typeof msg === 'string') {
          try {
            response = JSON.parse(msg);
          } catch (error) {
            response = msg;
          }
        }
        if (response.success === true || response.success === 'true' || response === 'OK') {
          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('.contactForm').find("input:not([type='hidden']), textarea").val("");
          showContactSuccess();
        } else {
          $("#sendmessage").removeClass("show");
          $("#errormessage").addClass("show");
          $('#errormessage').html(msg);
        }
      },
      error: function() {
        $("#sendmessage").removeClass("show");
        $("#errormessage").addClass("show").html('Unable to send your message. Please try again.');
      }
    });
    return false;
  });

});
