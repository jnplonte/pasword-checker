var passwordChecker = (function ($) {
    var defaultData = {
        "container":    "#password-checker",
				"submitbtn":		"#submit-button",
        "minLen":       8,
				"saveData":		 	true,
				"saveName":		 	"savedPassword"
    };

		var data;

		var isPass = 0;

    function startChecker(data) {
				var self = this, fdata = [];
        self.data = $.extend(defaultData, data);
				self.apendEl(data.container);
				$(self.data.container).keyup(function(ev){
					var v = self.checkStrength($(ev.target).val());
					$('.password-result').html(v);
				})

				$(self.data.submitbtn).click(function(ev){
					if(self.isPass && self.data.saveData){
							var pvalue = $(self.data.container).val();
							if(self.readStorage(self.data.saveName) != null){
								fdata = self.readStorage(self.data.saveName);
							}
							fdata.push(pvalue);
							self.createStorage(self.data.saveName, fdata);
					}

					self.isPass = 0;
					$(self.data.container).val('');
					$(self.data.submitbtn).removeAttr("style");
					$('.password-result').html('');
				})
    };

		function apendEl(container) {
			$(container).after( "<span class='password-result'></span>" );
		};

		function sugestPassword(char){
	    var self = this, text = "", isGood = false, cS = {'a':'@', 'e':'#', 'i':'!', 'o':'0', 'u':'&'};

			pchar = char.split('');

			$.each(pchar, function( index, value ) {
				if(typeof(cS[value]) != 'undefined'){
					isGood = true;
					text += cS[value];
				}else{
					if((Math.floor(Math.random() * 2) + 1) == 1){
						text += value.toUpperCase();
					}else{
						text += value;
					}
				}
			});
			if(isGood){
		    return text;
			}else{
				if((Math.floor(Math.random() * 2) + 1) == 1){
					return '*' + text + '*';
				}else{
					return '^' + text + '^';
				}
			}
		};

		function checkStrength(password){
			var self = this, strength = 0, fpassword = "";

			if (password.length < self.data.minLen) {
				$('.password-result').removeAttr("style");
				$('.password-result').css({"color":"#FF0000"});

				for (var i = 0; i < self.data.minLen; i++) {
					fpassword += password.charAt(Math.floor(Math.random() * password.length));
				}
				self.isPass = 0;
				$(self.data.submitbtn).removeAttr("style");
				return 'Password is Weak we suggest: '+ sugestPassword(fpassword);
			}else{
				self.isPass = 1;
				$(self.data.submitbtn).css({"color":"green"});
			}

			if(self.isPass && self.data.saveData){
				if(self.readStorage(self.data.saveName) != null){
					if(self.readStorage(self.data.saveName).indexOf(password) != -1){
						$('.password-result').removeAttr("style");
						$('.password-result').css({"color":"#E66C2C"});
						return 'Password is Duplicate we suggest: '+ sugestPassword(password);
					}
				}
			}

			if (password.length >= self.data.minLen) strength += 1;
			if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1;

			if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1;
			if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1;
			if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

			if (strength < 2 ){
				$('.password-result').removeAttr("style");
				$('.password-result').css({"color":"#E66C2C"});
				return 'Password is Acceptable we suggest: '+ sugestPassword(password);
			}else if (strength == 2 ){
				$('.password-result').removeAttr("style");
				$('.password-result').css({"color":"#2D98F3"});
				return 'Password is Good we suggest: '+ sugestPassword(password);
			}else{
				$('.password-result').removeAttr("style");
				$('.password-result').css({"color":"#006400"});
				return 'Password is Strong';
			}
		}

    return {
        start: startChecker,

				sugestPassword: sugestPassword,
				checkStrength: checkStrength,
				apendEl: apendEl,

				createStorage: function(name, value) {
					if (localStorage) {
						localStorage.setItem(name, this.toString(value));
						ret_val = true;
					} else {
						ret_val = false;
					}
					return ret_val;
				},

				readStorage: function(name) {
					if (localStorage) {
						ret_val = localStorage.getItem(name);
					} else {
						ret_val = null;
					}
					return this.toJson(ret_val);
				},

				toJson: function(json_data) {
					var response;
						try {
							response = JSON.parse(json_data);
						} catch (e) {
							response = json_data;
						}
					if (response) {
						return response;
					} else {
						return null;
					}
				},

				toString: function(json_data) {
					var response;
					if (typeof(json_data) == 'function') {
						return null;
					}
					if (typeof(json_data) == 'object') {
						try {
							response = JSON.stringify(json_data);
						} catch (e) {
							response = json_data;
						}
					} else {
						response = json_data;
					}
					return response;
				}
    };

})(jQuery);
