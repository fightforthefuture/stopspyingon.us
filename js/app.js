'use strict';

document.addEventListener("DOMContentLoaded", function() {
  var AN_PETITION_ID = "CHANGE_ME_PLZ";
  var AN_TAGS = ["surveillance", "702reauth"];
  var GENERIC_ERROR = "Unfortunately, that didn't work.";

  var app = new Vue({
    el: '#app',

    data: function() {
      return {
        formMessage: null,
        isLoading: false,
        modalVisible: false,
        name: null,
        email: null,
        street: null,
        zipCode: null
      }
    },

    methods: {
      submitForm: function() {
        var self = this;
        self.isLoading = true;
        self.$http.post('https://queue.fightforthefuture.org/action', {
          member: {
            first_name: self.name,
            email: self.email,
            postcode: self.zipCode,
            street_address: self.street,
            country: 'US'
          },
          hp_enabled: 'true',
          guard: '',
          contact_congress: 0,
          org: 'fftf',
          an_tags: JSON.stringify(AN_TAGS),
          an_petition_id: AN_PETITION_ID
        }, { emulateJSON: true })
        .then(function(response){
          self.isLoading = false;

          if (response.ok) {
            self.resetForm();
            self.showModal();
          }
          else {
            self.formMessage = GENERIC_ERROR;
          }
        })
        .catch(function(error){
          self.isLoading = false;
          self.formMessage = GENERIC_ERROR;
        })
      },

      resetForm: function() {
        this.name = null;
        this.email = null;
        this.street = null;
        this.zipCode = null;
      },

      showModal: function() {
        this.modalVisible = true;
        document.querySelector('body').classList.add('modal-open');
      },

      hideModal: function() {
        this.modalVisible = false;
        document.querySelector('body').classList.remove('modal-open');
      },

      getMetaContent: function(name) {
        var el = document.querySelector('meta[name="' + name + '"]') || document.querySelector('meta[property="' + name + '"]');
        
        if (el) {
          return el.getAttribute('content');
        }

        return null;
      },

      openPopup: function(url, title='popup', w=600, h=500) {
        // Fixes dual-screen position
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
          newWindow.focus();
        }
      },

      shareOnFacebook: function() {
        var url = this.getMetaContent('og:url');
        this.openPopup('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), 'facebook');
      },

      shareOnTwitter: function() {
        var tweetText = this.getMetaContent('twitter:description') + ' ' + this.getMetaContent('twitter:url');
        this.openPopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText), 'twitter');
      }
    }
  });
});