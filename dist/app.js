/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(5);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./main.pcss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./main.pcss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n}", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?importLoaders=1!./../../node_modules/resolve-url-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?importLoaders=1!./../../node_modules/resolve-url-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Fira+Sans:400,500,700&amp;\n\nsubset=cyrillic);", ""]);

	// module
	exports.push([module.id, "html,\nbody,\np,\nol,\nul,\nli,\ndl,\ndt,\ndd,\nblockquote,\nfigure,\nfieldset,\nlegend,\ntextarea,\npre,\niframe,\nhr,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin: 0;\n  padding: 0;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%;\n  font-weight: normal;\n}\n\nul {\n  list-style: none;\n}\n\nbutton,\ninput,\nselect,\ntextarea {\n  margin: 0;\n}\n\nhtml {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}\n\n*:before,\n*:after {\n  box-sizing: inherit;\n}\n\nimg,\nembed,\nobject,\naudio,\nvideo {\n  height: auto;\n  max-width: 100%;\n}\n\niframe {\n  border: 0;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n  text-align: left;\n}\n\nhtml {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  font-family: 'Fira Sans', \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  height: 100%;\n  line-height: 1.42857143;\n}\n\nbody {\n  color: #d0d0d0;\n  background: #323232;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  width: 100%;\n  overflow: hidden;\n}\n\na {\n  color: #d0d0d0;\n  text-decoration: none;\n}\n\na:hover {\n  color: #ffffff;\n}\n\n.btn {\n  border-radius: 5px;\n  font-size: 15.6px;\n  font-size: 1.2rem;\n  margin: 10px;\n  padding: 8px 16px;\n  text-align: center;\n  text-decoration: none;\n  transition: color .3s, border-color .3s, background .3s;\n  display: inline-block;\n}\n\n.btn.-unsubscribe,\n.btn.-up {\n  color: #E57066;\n  border: 1px #E57066 solid;\n}\n\n.btn.-unsubscribe:hover,\n.btn.-up:hover {\n  color: #ffffff;\n  background-color: #E57066;\n}\n\n.btn.-subscribe,\n.btn.-in {\n  color: #21bb9f;\n  border: 1px #21bb9f solid;\n}\n\n.btn.-subscribe:hover,\n.btn.-in:hover {\n  color: #ffffff;\n  background-color: #21bb9f;\n}\n\n.btn.-question {\n  color: #21bb9f;\n  border: 1px #21bb9f solid;\n}\n\n.btn.-question:hover {\n  color: #ffffff;\n  background-color: #21bb9f;\n}\n\n.btn.-mark {\n  color: #21bb9f;\n  border: 1px #21bb9f solid;\n}\n\n.btn.-mark:hover {\n  color: #ffffff;\n  background-color: #21bb9f;\n}\n\nh1 {\n  color: white;\n  font-size: 45.5px;\n  font-size: 3.5rem;\n  font-weight: 500;\n}\n\nh2 {\n  color: white;\n  font-size: 29.9px;\n  font-size: 2.3rem;\n}\n\nh3 {\n  color: white;\n  font-size: 19.5px;\n  font-size: 1.5rem;\n}\n\nh4 {\n  font-size: 16.9px;\n  font-size: 1.3rem;\n}\n\n.main-wrapper {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  overflow: hidden;\n}\n\n.section-menu {\n  background: #2a2a2a;\n  box-shadow: 5px 0 10px -5px rgba(0, 0, 0, 0.75);\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  padding-bottom: 16px;\n  width: 250px;\n}\n\n.section-menu .item {\n  padding: 16px 24px;\n}\n\n.section-menu > .logo {\n  margin: 0 auto;\n  padding: 16px;\n}\n\n.section-menu > .logo > a {\n  font-weight: 600;\n  font-size: 23.4px;\n  font-size: 1.8rem;\n  letter-spacing: -2px;\n}\n\n.section-menu > .menu {\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n}\n\n.section-menu > .menu .item:hover {\n  background: #222222;\n}\n\n.section-menu > .menu .-choose {\n  background: #222222;\n  border-right: 3px solid #21bb9f;\n}\n\n.section-menu .action {\n  background: #595959;\n  padding: 8px;\n  text-align: center;\n}\n\n.section-menu .action > p {\n  padding: 8px 0;\n}\n\n.section-menu .action > h3 {\n  padding-top: 8px;\n}\n\n.section-menu > .footer {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  padding: 16px 24px;\n  text-align: center;\n}\n\n.section-menu > .footer .language {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: center;\n  justify-content: center;\n  padding: 16px 0;\n}\n\n.section-menu > .footer .language .ru,\n.section-menu > .footer .language .en {\n  padding: 0 16px;\n}\n\n.section-menu > .footer .version {\n  color: #595959;\n}\n\n.section-content {\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  overflow: hidden;\n  overflow-y: scroll;\n}\n\n.section-content > .wrapper {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n\n.section-content > .wrapper > .main-header {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n}\n\n.section-content > .wrapper > .content {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  padding: 16px 32px;\n}\n\n.section-content > .wrapper > .content > .head {\n  -ms-flex-align: center;\n  align-items: center;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n}\n\n.section-content > .wrapper > .content > .head > .main {\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  margin-right: 32px;\n}\n\n.section-content > .wrapper > .content > .head > .side {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  text-align: center;\n  width: 310px;\n}\n\n.section-content > .wrapper > .content > .body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  padding-top: 18px;\n  padding-bottom: 18px;\n}\n\n.section-content > .wrapper > .content > .body > .main {\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  margin-right: 32px;\n}\n\n.section-content > .wrapper > .content > .body > .side {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  width: 310px;\n}\n\n.section-content > .wrapper > .content > .body > .side > .widget-panel {\n  margin: 32px 0;\n}\n\n.section-content > .wrapper > .content > .body > .side > .widget-panel:first-child {\n  margin-top: 0;\n}\n\n.main-content {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n}\n\n.main-header {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  height: 350px;\n  background: url(" + __webpack_require__(7) + ") center no-repeat;\n  padding: 0 32px;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n\n.main-header > .head {\n  text-align: center;\n}\n\n.main-header > .head > .sign {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: center;\n  justify-content: center;\n  padding-top: 24px;\n}\n\n.main-header > .title {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n\n.main-header.-video {\n  background: none;\n  height: auto;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  padding: 0;\n}\n\n.main-header.-video > .game,\n.main-header.-video .channel {\n  padding: 16px 32px;\n  width: 50%;\n  text-align: center;\n  background: url(" + __webpack_require__(7) + ") center no-repeat;\n}\n\n.nav-path {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  padding: 8px 0;\n}\n\n.nav-path > h3 {\n  padding: 8px 40px;\n}\n\n.nav-path .choose {\n  border-bottom: 3px solid #21bb9f;\n}\n\n.games-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n\n.games-list > .list {\n  padding-top: 16px;\n}\n\n.games-list > .list .more {\n  border-bottom: 1px solid #222222;\n  padding: 16px 0;\n  text-align: center;\n}\n\n.game-card {\n  box-sizing: border-box;\n  padding: 8px;\n  background: #222222;\n}\n\n.game-card > .preview {\n  padding-bottom: 56%;\n}\n\n.list-head {\n  -ms-flex-align: center;\n  align-items: center;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n\n.channels-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  margin-top: 22px;\n}\n\n.channels-list > .more {\n  text-align: center;\n  padding: 16px 0;\n  border-bottom: 1px solid #222222;\n}\n\n.channel-card {\n  box-sizing: border-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n  padding: 16px 8px;\n  background: #222222;\n}\n\n.channel-card > .ava {\n  background-color: #1e5e5e;\n  border-radius: 50%;\n  width: 80%;\n}\n\n.channel-card > .ava > .image {\n  background: #21bb9f;\n  padding-bottom: 100%;\n  width: 100%;\n  border-radius: 50%;\n}\n\n.channel-card > .name {\n  text-align: center;\n  padding: 16px 0;\n}\n\n.channel-card > .video {\n  width: 100%;\n  padding: 16px 0 8px 0;\n}\n\n.channel-card > .video .preview {\n  background-color: #1e5e5e;\n  padding-bottom: 56.25%;\n}\n\n.wrapped-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin: 0 -8px;\n}\n\n.wrapped-list > .holder {\n  padding: 8px;\n  -ms-flex: 1 0 auto;\n  flex: 1 0 auto;\n  max-width: 50%;\n  width: 180px;\n}\n\n.wrapped-list > .placeholder {\n  -ms-flex: 1 0 auto;\n  flex: 1 0 auto;\n  max-width: 50%;\n  width: 180px;\n}\n\n.wrapped-list.-game > .holder {\n  width: 280px;\n}\n\n.wrapped-list.-game > .placeholder {\n  width: 280px;\n}\n\n.wrapped-list.-featured > .holder {\n  width: 400px;\n}\n\n.wrapped-list.-featured > .placeholder {\n  width: 400px;\n}\n\n.wrapped-list.-video > .holder {\n  width: 280px;\n}\n\n.wrapped-list.-video > .placeholder {\n  width: 280px;\n}\n\n.wrapped-list.-col1 {\n  padding-bottom: 32px;\n}\n\n.wrapped-list.-col1 > .holder {\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n}\n\n.wrapped-list.-playlist > .holder {\n  width: 100%;\n  max-width: 100%;\n}\n\n.featured-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  padding-top: 40px;\n}\n\n.featured-card {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  box-sizing: border-box;\n  background: #222222;\n  padding: 24px;\n}\n\n.featured-card > .head {\n  border-bottom: 1px solid #595959;\n  padding: 8px 0 16px 0;\n  text-align: center;\n}\n\n.featured-card > .table {\n  padding-top: 16px;\n}\n\n.featured-card > .table .title,\n.featured-card > .table .row {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n\n.featured-card > .table .title {\n  padding-bottom: 16px;\n  color: white;\n}\n\n.featured-card > .table .row {\n  border-bottom: 1px solid #595959;\n  padding: 16px 0;\n}\n\n.video-list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n\n.video-list > .list {\n  padding-top: 16px;\n}\n\n.video-card {\n  background: #222222;\n  box-sizing: border-box;\n  padding: 8px;\n}\n\n.video-card > .preview {\n  padding-bottom: 56%;\n}\n\n.video-card.-channel {\n  background: #2a2a2a;\n  width: 100%;\n}\n\n.widget-panel {\n  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n  border-radius: 5px;\n  padding: 8px 24px;\n  text-align: center;\n}\n\n.widget-panel > .title {\n  border-bottom: 1px solid #222222;\n  padding: 10px 0;\n  text-align: center;\n}\n\n.widget-panel.-qa {\n  font-weight: normal;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  text-align: left;\n}\n\n.widget-panel.-qa > .title {\n  border-bottom: none;\n}\n\n.widget-panel.-qa .question {\n  padding: 8px 0;\n}\n\n.widget-panel.-qa .question > .statistic {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  color: #595959;\n}\n\n.widget-panel.-qa .question > .statistic > .answer {\n  padding-right: 20px;\n}\n\n.widget-panel.-qa .more-qa {\n  border-top: 1px solid #222222;\n  padding: 15px 0 10px 0;\n  margin-top: 10px;\n  text-align: center;\n}\n\n.next-page {\n  text-align: right;\n  padding: 16px 0;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9DU1MvTGV0c1BsYXlIdWIvYXBwL2Nzcy9tYWluLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUdBQWlHO0FBQ2pHLDJFQUEyRTtBQUMzRTtFQUNFLFVBQVU7RUFDVixXQUFXLEVBQUU7QUFFZjtFQUNFLGdCQUFnQjtFQUNoQixvQkFBb0IsRUFBRTtBQUV4QjtFQUNFLGlCQUFpQixFQUFFO0FBRXJCO0VBQ0UsVUFBVSxFQUFFO0FBRWQ7RUFDRSx1QkFBdUIsRUFBRTtBQUUzQjtFQUNFLG9CQUFvQixFQUFFO0FBRXhCO0VBQ0Usb0JBQW9CLEVBQUU7QUFFeEI7RUFDRSxhQUFhO0VBQ2IsZ0JBQWdCLEVBQUU7QUFFcEI7RUFDRSxVQUFVLEVBQUU7QUFFZDtFQUNFLDBCQUEwQjtFQUMxQixrQkFBa0IsRUFBRTtBQUV0QjtFQUNFLFdBQVc7RUFDWCxpQkFBaUIsRUFBRTtBQUVyQjtFQUNFLHFCQUFjO0VBQWQsY0FBYztFQUNkLHdCQUFvQjtNQUFwQixvQkFBb0I7RUFDcEIseUVBQXlFO0VBQ3pFLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2Isd0JBQXdCLEVBQUU7QUFFNUI7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0VBQ3BCLHFCQUFjO0VBQWQsY0FBYztFQUNkLGFBQWE7RUFDYiwyQkFBdUI7TUFBdkIsdUJBQXVCO0VBQ3ZCLFlBQVk7RUFDWixpQkFBaUIsRUFBRTtBQUVyQjtFQUNFLGVBQWU7RUFDZixzQkFBc0IsRUFBRTtBQUN4QjtJQUNFLGVBQWUsRUFBRTtBQUVyQjtFQUNFLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFBbEIsa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLHNCQUFzQjtFQUN0Qix3REFBd0Q7RUFDeEQsc0JBQXNCLEVBQUU7QUFDeEI7SUFDRSxlQUFlO0lBQ2YsMEJBQTBCLEVBQUU7QUFDNUI7TUFDRSxlQUFlO01BQ2YsMEJBQTBCLEVBQUU7QUFDaEM7SUFDRSxlQUFlO0lBQ2YsMEJBQTBC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QjtJQUNwQixlQUFlLEVBQUU7QUFDbkI7SUFDRSxvQkFBb0IsRUFBRTtBQUN4QjtJQUNFLDhCQUE4QjtJQUM5Qix1QkFBdUI7SUFDdkIsaUJBQWlCO0lBQ2pCLG1CQUFtQixFQUFFO0FBRXpCO0VBQ0Usa0JBQWtCO0VBQ2xCLGdCQUFnQixFQUFFIiwiZmlsZSI6Im1haW4uc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgdXJsKFwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUZpcmErU2Fuczo0MDAsNTAwLDcwMCZhbXA7c3Vic2V0PWN5cmlsbGljXCIpO1xuLyohIG1pbmlyZXNldC5jc3MgdjAuMC4yIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL2pndGhtcy9taW5pcmVzZXQuY3NzICovXG5odG1sLCBib2R5LCBwLCBvbCwgdWwsIGxpLCBkbCwgZHQsIGRkLCBibG9ja3F1b3RlLCBmaWd1cmUsIGZpZWxkc2V0LCBsZWdlbmQsIHRleHRhcmVhLCBwcmUsIGlmcmFtZSwgaHIsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7IH1cblxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDsgfVxuXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7IH1cblxuYnV0dG9uLCBpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSB7XG4gIG1hcmdpbjogMDsgfVxuXG5odG1sIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxuXG4qIHtcbiAgYm94LXNpemluZzogaW5oZXJpdDsgfVxuXG4qOmJlZm9yZSwgKjphZnRlciB7XG4gIGJveC1zaXppbmc6IGluaGVyaXQ7IH1cblxuaW1nLCBlbWJlZCwgb2JqZWN0LCBhdWRpbywgdmlkZW8ge1xuICBoZWlnaHQ6IGF1dG87XG4gIG1heC13aWR0aDogMTAwJTsgfVxuXG5pZnJhbWUge1xuICBib3JkZXI6IDA7IH1cblxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDsgfVxuXG50ZCwgdGgge1xuICBwYWRkaW5nOiAwO1xuICB0ZXh0LWFsaWduOiBsZWZ0OyB9XG5cbmh0bWwge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmb250LWZhbWlseTogJ0ZpcmEgU2FucycsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGxpbmUtaGVpZ2h0OiAxLjQyODU3MTQzOyB9XG5cbmJvZHkge1xuICBjb2xvcjogI2QwZDBkMDtcbiAgYmFja2dyb3VuZDogIzMyMzIzMjtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMTAwJTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjsgfVxuXG5hIHtcbiAgY29sb3I6ICNkMGQwZDA7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTsgfVxuICBhOmhvdmVyIHtcbiAgICBjb2xvcjogI2ZmZmZmZjsgfVxuXG4uYnRuIHtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBmb250LXNpemU6IDEuMnJlbTtcbiAgbWFyZ2luOiAxMHB4O1xuICBwYWRkaW5nOiA4cHggMTZweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IGNvbG9yIC4zcywgYm9yZGVyLWNvbG9yIC4zcywgYmFja2dyb3VuZCAuM3M7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxuICAuYnRuLi11bnN1YnNjcmliZSwgLmJ0bi4tdXAge1xuICAgIGNvbG9yOiAjRTU3MDY2O1xuICAgIGJvcmRlcjogMXB4ICNFNTcwNjYgc29saWQ7IH1cbiAgICAuYnRuLi11bnN1YnNjcmliZTpob3ZlciwgLmJ0bi4tdXA6aG92ZXIge1xuICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRTU3MDY2OyB9XG4gIC5idG4uLXN1YnNjcmliZSwgLmJ0bi4taW4ge1xuICAgIGNvbG9yOiAjMjFiYjlmO1xuICAgIGJvcmRlcjogMXB4ICMyMWJiOWYgc29saWQ7IH1cbiAgICAuYnRuLi1zdWJzY3JpYmU6aG92ZXIsIC5idG4uLWluOmhvdmVyIHtcbiAgICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzIxYmI5ZjsgfVxuICAuYnRuLi1xdWVzdGlvbiB7XG4gICAgY29sb3I6ICMyMWJiOWY7XG4gICAgYm9yZGVyOiAxcHggIzIxYmI5ZiBzb2xpZDsgfVxuICAgIC5idG4uLXF1ZXN0aW9uOmhvdmVyIHtcbiAgICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzIxYmI5ZjsgfVxuICAuYnRuLi1tYXJrIHtcbiAgICBjb2xvcjogIzIxYmI5ZjtcbiAgICBib3JkZXI6IDFweCAjMjFiYjlmIHNvbGlkOyB9XG4gICAgLmJ0bi4tbWFyazpob3ZlciB7XG4gICAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMyMWJiOWY7IH1cblxuaDEge1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtc2l6ZTogMy41cmVtO1xuICBmb250LXdlaWdodDogNTAwOyB9XG5cbmgyIHtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXNpemU6IDIuM3JlbTsgfVxuXG5oMyB7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZm9udC1zaXplOiAxLjVyZW07IH1cblxuaDQge1xuICBmb250LXNpemU6IDEuM3JlbTsgfVxuXG4ubWFpbi13cmFwcGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZmxleC1ncm93OiAxO1xuICBvdmVyZmxvdzogaGlkZGVuOyB9XG5cbi5zZWN0aW9uLW1lbnUge1xuICBiYWNrZ3JvdW5kOiAjMmEyYTJhO1xuICBib3gtc2hhZG93OiA1cHggMCAxMHB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjc1KTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZmxleC1zaHJpbms6IDA7XG4gIHBhZGRpbmctYm90dG9tOiAxNnB4O1xuICB3aWR0aDogMjUwcHg7IH1cbiAgLnNlY3Rpb24tbWVudSAuaXRlbSB7XG4gICAgcGFkZGluZzogMTZweCAyNHB4OyB9XG4gIC5zZWN0aW9uLW1lbnUgPiAubG9nbyB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgcGFkZGluZzogMTZweDsgfVxuICAgIC5zZWN0aW9uLW1lbnUgPiAubG9nbyA+IGEge1xuICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgIGZvbnQtc2l6ZTogMS44cmVtO1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IC0ycHg7IH1cbiAgLnNlY3Rpb24tbWVudSA+IC5tZW51IHtcbiAgICBmbGV4LWdyb3c6IDE7IH1cbiAgICAuc2VjdGlvbi1tZW51ID4gLm1lbnUgLml0ZW06aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogIzIyMjIyMjsgfVxuICAgIC5zZWN0aW9uLW1lbnUgPiAubWVudSAuLWNob29zZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMjIyMjIyO1xuICAgICAgYm9yZGVyLXJpZ2h0OiAzcHggc29saWQgIzIxYmI5ZjsgfVxuICAuc2VjdGlvbi1tZW51IC5hY3Rpb24ge1xuICAgIGJhY2tncm91bmQ6ICM1OTU5NTk7XG4gICAgcGFkZGluZzogOHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgfVxuICAgIC5zZWN0aW9uLW1lbnUgLmFjdGlvbiA+IHAge1xuICAgICAgcGFkZGluZzogOHB4IDA7IH1cbiAgICAuc2VjdGlvbi1tZW51IC5hY3Rpb24gPiBoMyB7XG4gICAgICBwYWRkaW5nLXRvcDogOHB4OyB9XG4gIC5zZWN0aW9uLW1lbnUgPiAuZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgcGFkZGluZzogMTZweCAyNHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgfVxuICAgIC5zZWN0aW9uLW1lbnUgPiAuZm9vdGVyIC5sYW5ndWFnZSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgcGFkZGluZzogMTZweCAwOyB9XG4gICAgICAuc2VjdGlvbi1tZW51ID4gLmZvb3RlciAubGFuZ3VhZ2UgLnJ1LCAuc2VjdGlvbi1tZW51ID4gLmZvb3RlciAubGFuZ3VhZ2UgLmVuIHtcbiAgICAgICAgcGFkZGluZzogMCAxNnB4OyB9XG4gICAgLnNlY3Rpb24tbWVudSA+IC5mb290ZXIgLnZlcnNpb24ge1xuICAgICAgY29sb3I6ICM1OTU5NTk7IH1cblxuLnNlY3Rpb24tY29udGVudCB7XG4gIGZsZXgtZ3JvdzogMTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3ZlcmZsb3cteTogc2Nyb2xsOyB9XG4gIC5zZWN0aW9uLWNvbnRlbnQgPiAud3JhcHBlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyB9XG4gICAgLnNlY3Rpb24tY29udGVudCA+IC53cmFwcGVyID4gLm1haW4taGVhZGVyIHtcbiAgICAgIGZsZXgtc2hyaW5rOiAwOyB9XG4gICAgLnNlY3Rpb24tY29udGVudCA+IC53cmFwcGVyID4gLmNvbnRlbnQge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICBwYWRkaW5nOiAxNnB4IDMycHg7IH1cbiAgICAgIC5zZWN0aW9uLWNvbnRlbnQgPiAud3JhcHBlciA+IC5jb250ZW50ID4gLmhlYWQge1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93OyB9XG4gICAgICAgIC5zZWN0aW9uLWNvbnRlbnQgPiAud3JhcHBlciA+IC5jb250ZW50ID4gLmhlYWQgPiAubWFpbiB7XG4gICAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICAgIG1hcmdpbi1yaWdodDogMzJweDsgfVxuICAgICAgICAuc2VjdGlvbi1jb250ZW50ID4gLndyYXBwZXIgPiAuY29udGVudCA+IC5oZWFkID4gLnNpZGUge1xuICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICB3aWR0aDogMzEwcHg7IH1cbiAgICAgIC5zZWN0aW9uLWNvbnRlbnQgPiAud3JhcHBlciA+IC5jb250ZW50ID4gLmJvZHkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBwYWRkaW5nLXRvcDogMThweDtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDE4cHg7IH1cbiAgICAgICAgLnNlY3Rpb24tY29udGVudCA+IC53cmFwcGVyID4gLmNvbnRlbnQgPiAuYm9keSA+IC5tYWluIHtcbiAgICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgICAgbWFyZ2luLXJpZ2h0OiAzMnB4OyB9XG4gICAgICAgIC5zZWN0aW9uLWNvbnRlbnQgPiAud3JhcHBlciA+IC5jb250ZW50ID4gLmJvZHkgPiAuc2lkZSB7XG4gICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgICAgd2lkdGg6IDMxMHB4OyB9XG4gICAgICAgICAgLnNlY3Rpb24tY29udGVudCA+IC53cmFwcGVyID4gLmNvbnRlbnQgPiAuYm9keSA+IC5zaWRlID4gLndpZGdldC1wYW5lbCB7XG4gICAgICAgICAgICBtYXJnaW46IDMycHggMDsgfVxuICAgICAgICAgICAgLnNlY3Rpb24tY29udGVudCA+IC53cmFwcGVyID4gLmNvbnRlbnQgPiAuYm9keSA+IC5zaWRlID4gLndpZGdldC1wYW5lbDpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgIG1hcmdpbi10b3A6IDA7IH1cblxuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7IH1cblxuLm1haW4taGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgaGVpZ2h0OiAzNTBweDtcbiAgYmFja2dyb3VuZDogdXJsKFwiLi4vLi4vaW1hZ2VzL3NreS5qcGdcIikgY2VudGVyIG5vLXJlcGVhdDtcbiAgcGFkZGluZzogMCAzMnB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgfVxuICAubWFpbi1oZWFkZXIgPiAuaGVhZCB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyB9XG4gICAgLm1haW4taGVhZGVyID4gLmhlYWQgPiAuc2lnbiB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgcGFkZGluZy10b3A6IDI0cHg7IH1cbiAgLm1haW4taGVhZGVyID4gLnRpdGxlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyB9XG5cbi5tYWluLWhlYWRlci4tdmlkZW8ge1xuICBiYWNrZ3JvdW5kOiBub25lO1xuICBoZWlnaHQ6IGF1dG87XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIHBhZGRpbmc6IDA7IH1cbiAgLm1haW4taGVhZGVyLi12aWRlbyA+IC5nYW1lLCAubWFpbi1oZWFkZXIuLXZpZGVvIC5jaGFubmVsIHtcbiAgICBwYWRkaW5nOiAxNnB4IDMycHg7XG4gICAgd2lkdGg6IDUwJTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZDogdXJsKFwiLi4vLi4vaW1hZ2VzL3NreS5qcGdcIikgY2VudGVyIG5vLXJlcGVhdDsgfVxuXG4ubmF2LXBhdGgge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBwYWRkaW5nOiA4cHggMDsgfVxuICAubmF2LXBhdGggPiBoMyB7XG4gICAgcGFkZGluZzogOHB4IDQwcHg7IH1cbiAgLm5hdi1wYXRoIC5jaG9vc2Uge1xuICAgIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjMjFiYjlmOyB9XG5cbi5nYW1lcy1saXN0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxuICAuZ2FtZXMtbGlzdCA+IC5saXN0IHtcbiAgICBwYWRkaW5nLXRvcDogMTZweDsgfVxuICAgIC5nYW1lcy1saXN0ID4gLmxpc3QgLm1vcmUge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICMyMjIyMjI7XG4gICAgICBwYWRkaW5nOiAxNnB4IDA7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cblxuLmdhbWUtY2FyZCB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIHBhZGRpbmc6IDhweDtcbiAgYmFja2dyb3VuZDogIzIyMjIyMjsgfVxuICAuZ2FtZS1jYXJkID4gLnByZXZpZXcge1xuICAgIHBhZGRpbmctYm90dG9tOiA1NiU7IH1cblxuLmxpc3QtaGVhZCB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgfVxuXG4uY2hhbm5lbHMtbGlzdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1hcmdpbi10b3A6IDIycHg7IH1cbiAgLmNoYW5uZWxzLWxpc3QgPiAubW9yZSB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHBhZGRpbmc6IDE2cHggMDtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzIyMjIyMjsgfVxuXG4uY2hhbm5lbC1jYXJkIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDE2cHggOHB4O1xuICBiYWNrZ3JvdW5kOiAjMjIyMjIyOyB9XG4gIC5jaGFubmVsLWNhcmQgPiAuYXZhIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWU1ZTVlO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICB3aWR0aDogODAlOyB9XG4gICAgLmNoYW5uZWwtY2FyZCA+IC5hdmEgPiAuaW1hZ2Uge1xuICAgICAgYmFja2dyb3VuZDogIzIxYmI5ZjtcbiAgICAgIHBhZGRpbmctYm90dG9tOiAxMDAlO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBib3JkZXItcmFkaXVzOiA1MCU7IH1cbiAgLmNoYW5uZWwtY2FyZCA+IC5uYW1lIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgcGFkZGluZzogMTZweCAwOyB9XG4gIC5jaGFubmVsLWNhcmQgPiAudmlkZW8ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmc6IDE2cHggMCA4cHggMDsgfVxuICAgIC5jaGFubmVsLWNhcmQgPiAudmlkZW8gLnByZXZpZXcge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzFlNWU1ZTtcbiAgICAgIHBhZGRpbmctYm90dG9tOiA1Ni4yNSU7IH1cblxuLndyYXBwZWQtbGlzdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgbWFyZ2luOiAwIC04cHg7IH1cbiAgLndyYXBwZWQtbGlzdCA+IC5ob2xkZXIge1xuICAgIHBhZGRpbmc6IDhweDtcbiAgICBmbGV4OiAxIDAgYXV0bztcbiAgICBtYXgtd2lkdGg6IDUwJTtcbiAgICB3aWR0aDogMTgwcHg7IH1cbiAgLndyYXBwZWQtbGlzdCA+IC5wbGFjZWhvbGRlciB7XG4gICAgZmxleDogMSAwIGF1dG87XG4gICAgbWF4LXdpZHRoOiA1MCU7XG4gICAgd2lkdGg6IDE4MHB4OyB9XG5cbi53cmFwcGVkLWxpc3QuLWdhbWUgPiAuaG9sZGVyIHtcbiAgd2lkdGg6IDI4MHB4OyB9XG5cbi53cmFwcGVkLWxpc3QuLWdhbWUgPiAucGxhY2Vob2xkZXIge1xuICB3aWR0aDogMjgwcHg7IH1cblxuLndyYXBwZWQtbGlzdC4tZmVhdHVyZWQgPiAuaG9sZGVyIHtcbiAgd2lkdGg6IDQwMHB4OyB9XG5cbi53cmFwcGVkLWxpc3QuLWZlYXR1cmVkID4gLnBsYWNlaG9sZGVyIHtcbiAgd2lkdGg6IDQwMHB4OyB9XG5cbi53cmFwcGVkLWxpc3QuLXZpZGVvID4gLmhvbGRlciB7XG4gIHdpZHRoOiAyODBweDsgfVxuXG4ud3JhcHBlZC1saXN0Li12aWRlbyA+IC5wbGFjZWhvbGRlciB7XG4gIHdpZHRoOiAyODBweDsgfVxuXG4ud3JhcHBlZC1saXN0Li1jb2wxIHtcbiAgcGFkZGluZy1ib3R0b206IDMycHg7IH1cbiAgLndyYXBwZWQtbGlzdC4tY29sMSA+IC5ob2xkZXIge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBwYWRkaW5nOiAwOyB9XG5cbi53cmFwcGVkLWxpc3QuLXBsYXlsaXN0ID4gLmhvbGRlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMCU7IH1cblxuLmZlYXR1cmVkLWxpc3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBwYWRkaW5nLXRvcDogNDBweDsgfVxuXG4uZmVhdHVyZWQtY2FyZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQ6ICMyMjIyMjI7XG4gIHBhZGRpbmc6IDI0cHg7IH1cbiAgLmZlYXR1cmVkLWNhcmQgPiAuaGVhZCB7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM1OTU5NTk7XG4gICAgcGFkZGluZzogOHB4IDAgMTZweCAwO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgfVxuICAuZmVhdHVyZWQtY2FyZCA+IC50YWJsZSB7XG4gICAgcGFkZGluZy10b3A6IDE2cHg7IH1cbiAgICAuZmVhdHVyZWQtY2FyZCA+IC50YWJsZSAudGl0bGUsIC5mZWF0dXJlZC1jYXJkID4gLnRhYmxlIC5yb3cge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IH1cbiAgICAuZmVhdHVyZWQtY2FyZCA+IC50YWJsZSAudGl0bGUge1xuICAgICAgcGFkZGluZy1ib3R0b206IDE2cHg7XG4gICAgICBjb2xvcjogd2hpdGU7IH1cbiAgICAuZmVhdHVyZWQtY2FyZCA+IC50YWJsZSAucm93IHtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNTk1OTU5O1xuICAgICAgcGFkZGluZzogMTZweCAwOyB9XG5cbi52aWRlby1saXN0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxuICAudmlkZW8tbGlzdCA+IC5saXN0IHtcbiAgICBwYWRkaW5nLXRvcDogMTZweDsgfVxuXG4udmlkZW8tY2FyZCB7XG4gIGJhY2tncm91bmQ6ICMyMjIyMjI7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIHBhZGRpbmc6IDhweDsgfVxuICAudmlkZW8tY2FyZCA+IC5wcmV2aWV3IHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNTYlOyB9XG4gIC52aWRlby1jYXJkLi1jaGFubmVsIHtcbiAgICBiYWNrZ3JvdW5kOiAjMmEyYTJhO1xuICAgIHdpZHRoOiAxMDAlOyB9XG5cbi53aWRnZXQtcGFuZWwge1xuICBib3gtc2hhZG93OiAwIDRweCAyMHB4IDAgcmdiYSgwLCAwLCAwLCAwLjIpLCAwIDZweCAyMHB4IDAgcmdiYSgwLCAwLCAwLCAwLjE5KTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiA4cHggMjRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyOyB9XG4gIC53aWRnZXQtcGFuZWwgPiAudGl0bGUge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjMjIyMjIyO1xuICAgIHBhZGRpbmc6IDEwcHggMDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cblxuLndpZGdldC1wYW5lbC4tcWEge1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHRleHQtYWxpZ246IGxlZnQ7IH1cbiAgLndpZGdldC1wYW5lbC4tcWEgPiAudGl0bGUge1xuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IH1cbiAgLndpZGdldC1wYW5lbC4tcWEgLnF1ZXN0aW9uIHtcbiAgICBwYWRkaW5nOiA4cHggMDsgfVxuICAud2lkZ2V0LXBhbmVsLi1xYSAucXVlc3Rpb24gPiAuc3RhdGlzdGljIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgY29sb3I6ICM1OTU5NTk7IH1cbiAgLndpZGdldC1wYW5lbC4tcWEgLnF1ZXN0aW9uID4gLnN0YXRpc3RpYyA+IC5hbnN3ZXIge1xuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7IH1cbiAgLndpZGdldC1wYW5lbC4tcWEgLm1vcmUtcWEge1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjMjIyMjIyO1xuICAgIHBhZGRpbmc6IDE1cHggMCAxMHB4IDA7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cblxuLm5leHQtcGFnZSB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBwYWRkaW5nOiAxNnB4IDA7IH1cbiJdfQ== */", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "bb0c6733fabbd7028c25ecba78ecdc6d.jpg";

/***/ }
/******/ ]);