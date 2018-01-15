'use strict';

document.addEventListener("DOMContentLoaded", function() {
  var CAMPAIGN_ID = '702reauth';

  var app = new Vue({
    el: '#app',

    data: function() {
      return {
        phone: null,
        errorMessage: null,
        isSubmitting: false,
        modalVisible: false
      }
    },

    methods: {
      submitForm: function() {
        var self = this;
        self.isSubmitting = true;
        self.$http.post('https://call-congress.fightforthefuture.org/create', {
          campaignId: CAMPAIGN_ID,
          userPhone: self.phone,
          zipcode: null
        }, { emulateJSON: true })
        .then(function(response){
          self.isSubmitting = false;

          if (response.ok && response.body.call === 'queued') {
            self.phone = null;
            self.errorMessage = null;
            self.showModal();
          }
          else {
            self.errorMessage = "That didn't work for some reason :(";
          }
        })
        .catch(function(error){
          self.isSubmitting = false;
          self.errorMessage = "That didn't work for some reason :(";
        })
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