/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*!
 * jQuery UI Core 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.3",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
/*!
 * jQuery UI Widget 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );



/*!
 * jQuery UI Button 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-button" ).button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.10.3",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "",
			focusClass = "ui-state-focus";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		this.element
			.bind( "focus" + this.eventNamespace, function() {
				// no need to check disabled, focus won't be triggered anyway
				that.buttonElement.addClass( focusClass );
			})
			.bind( "blur" + this.eventNamespace, function() {
				that.buttonElement.removeClass( focusClass );
			});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				if ( clickDragged ) {
					return;
				}
				that.refresh();
			});
			// if mouse moves between mousedown and mouseup (drag) set clickDragged flag
			// prevents issue where button state changes but checkbox/radio checked state
			// does not in Firefox (see ticket #6970)
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					clickDragged = false;
					startXPos = event.pageX;
					startYPos = event.pageY;
				})
				.bind( "mouseup" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
						clickDragged = true;
					}
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				// see #8559, we bind to blur here in case the button element loses
				// focus between keydown and keyup, it would be left in an "active" state
				.bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
			} else {
				this.element.prop( "disabled", false );
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.10.3",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl";

		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

}( jQuery ) );



/*!
 * jQuery UI Mouse 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.3",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);




/*!
 * jQuery UI Draggable 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
			this.element[0].style.position = "relative";
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent();
		this.offsetParent = this.helper.offsetParent();
		this.offsetParentCssPosition = this.offsetParent.css( "position" );

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		//Reset scroll cache
		this.offset.scroll = false;

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.offsetParentCssPosition === "fixed" ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		if ( this.options.helper === "original" && !$.contains( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

		if(!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		if(helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		//This needs to be actually done for all browsers, since pageX/pageY includes this information
		//Ugly IE fix
		if((this.offsetParent[0] === document.body) ||
			(this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var over, c, ce,
			o = this.options;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if( !ce ) {
			return;
		}

		over = c.css( "overflow" ) !== "hidden";

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ) ,
			( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) - ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) - this.helperProportions.width - this.margins.left - this.margins.right,
			( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) - ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) - this.helperProportions.height - this.margins.top  - this.margins.bottom
		];
		this.relative_container = c;
	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top ) * mod )
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left ) * mod )
			)
		};

	},

	_generatePosition: function(event) {

		var containment, co, top, left,
			o = this.options,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent,
			pageX = event.pageX,
			pageY = event.pageY;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( this.originalPosition ) {
			if ( this.containment ) {
				if ( this.relative_container ){
					co = this.relative_container.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				}
				else {
					containment = this.containment;
				}

				if(event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		//The absolute position has to be recalculated after plugins
		if(type === "drag") {
			this.positionAbs = this._convertPositionTo("absolute");
		}
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("ui-draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, "ui-sortable");
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("ui-draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
				if(this.shouldRevert) {
					this.instance.options.revert = this.shouldRevert;
				}

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper === "original") {
					this.instance.currentItem.css({ top: "auto", left: "auto" });
				}

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("ui-draggable"), that = this;

		$.each(inst.sortables, function() {

			var innermostIntersecting = false,
				thisSortable = this;

			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if (this !== thisSortable &&
						this.instance._intersectsWith(this.instance.containerCache) &&
						$.contains(thisSortable.instance.element[0], this.instance.element[0])
					) {
						innermostIntersecting = false;
					}
					return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) {
					this.instance._mouseDrag(event);
				}

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger("out", event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) {
						this.instance.placeholder.remove();
					}

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			}

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function() {
		var t = $("body"), o = $(this).data("ui-draggable").options;
		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function() {
		var o = $(this).data("ui-draggable").options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function() {
		var i = $(this).data("ui-draggable");
		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
			i.overflowOffset = i.scrollParent.offset();
		}
	},
	drag: function( event ) {

		var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

			if(!o.axis || o.axis !== "x") {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
				}
			}

			if(!o.axis || o.axis !== "y") {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if(!o.axis || o.axis !== "x") {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if(!o.axis || o.axis !== "y") {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function() {

		var i = $(this).data("ui-draggable"),
			o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if(this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function(event, ui) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			inst = $(this).data("ui-draggable"),
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if(inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
				}
			}

			first = (ts || bs || ls || rs);

			if(o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
				}
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function() {
		var min,
			o = this.data("ui-draggable").options,
			group = $.makeArray($(o.stack)).sort(function(a,b) {
				return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

})(jQuery);
/*!
 * jQuery UI Position 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );




/*!
 * jQuery UI Resizable 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/resizable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

function num(v) {
	return parseInt(v, 10) || 0;
}

function isNumber(value) {
	return !isNaN(parseInt(value, 10));
}

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},
	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"ui-resizable", this.element.data("ui-resizable")
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" });
		if(this.handles.constructor === String) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for(i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-"+handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				//Insert into internal handles object and append to element
				this.handles[handle] = ".ui-resizable-"+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for(i in this.handles) {

				if(this.handles[i].constructor === String) {
					this.handles[i] = $(this.handles[i], this.element).show();
				}

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					axis = $(this.handles[i], this.element);

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length) {
					continue;
				}
			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $(".ui-resizable-handle", this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
			};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			iniPos = this.element.position(),
			el = this.element;

		this.resizing = true;

		// bugfix for http://dev.jquery.com/ticket/1749
		if ( (/absolute/).test( el.css("position") ) ) {
			el.css({ position: "absolute", top: el.css("top"), left: el.css("left") });
		} else if (el.is(".ui-draggable")) {
			el.css({ position: "absolute", top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		curleft = num(this.helper.css("left"));
		curtop = num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var data,
			el = this.helper, props = {},
			smp = this.originalMousePosition,
			a = this.axis,
			prevTop = this.position.top,
			prevLeft = this.position.left,
			prevWidth = this.size.width,
			prevHeight = this.size.height,
			dx = (event.pageX-smp.left)||0,
			dy = (event.pageY-smp.top)||0,
			trigger = this._change[a];

		if (!trigger) {
			return false;
		}

		// Calculate the attrs that will be change
		data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		if (this.position.top !== prevTop) {
			props.top = this.position.top + "px";
		}
		if (this.position.left !== prevLeft) {
			props.left = this.position.left + "px";
		}
		if (this.size.width !== prevWidth) {
			props.width = this.size.width + "px";
		}
		if (this.size.height !== prevHeight) {
			props.height = this.size.height + "px";
		}
		el.css(props);

		if (!this._helper && this._proportionallyResizeElements.length) {
			this._proportionallyResize();
		}

		// Call the user callback if the element was resized
		if ( ! $.isEmptyObject(props) ) {
			this._trigger("resize", event, this.ui());
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if(this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) };
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if(pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if(pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if(pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var i, j, borders, paddings, prel,
			element = this.helper || this.element;

		for ( i=0; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				this.borderDif = [];
				borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
				paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

				for ( j = 0; j < borders.length; j++ ) {
					this.borderDif[ j ] = ( parseInt( borders[ j ], 10 ) || 0 ) + ( parseInt( paddings[ j ], 10 ) || 0 );
				}
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left +"px",
				top: this.elementOffset.top +"px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "animate", {

	stop: function( event ) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $(this).data("ui-resizable"),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;

		if (!ce) {
			return;
		}

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc === document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			element = $(ce);
			p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw );
			height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset, cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] !== document && (/static/).test(ce.css("position"))) {
			cop = co;
		}

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width );
		hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		isParent = that.containerElement.get(0) === that.element.parent().get(0);
		isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

		if(isParent && isOffsetRelative) {
			woset -= that.parentData.left;
		}

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
		}
	},

	stop: function(){
		var that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $(that.helper),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

		if (that._helper && !o.animate && (/static/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

	}
});

$.ui.plugin.add("resizable", "alsoResize", {

	start: function () {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			_store = function (exp) {
				$(exp).each(function() {
					var el = $(this);
					el.data("ui-resizable-alsoresize", {
						width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
						left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
					});
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
			},

			_alsoResize = function (exp, c) {
				$(exp).each(function() {
					var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
						css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

					$.each(css, function (i, prop) {
						var sum = (start[prop]||0) + (delta[prop]||0);
						if (sum && sum >= 0) {
							style[prop] = sum || null;
						}
					});

					el.css(style);
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function () {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function() {

		var that = $(this).data("ui-resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: 0.25, display: "block", position: "relative", height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass("ui-resizable-ghost")
			.addClass(typeof o.ghost === "string" ? o.ghost : "");

		that.ghost.appendTo(that.helper);

	},

	resize: function(){
		var that = $(this).data("ui-resizable");
		if (that.ghost) {
			that.ghost.css({ position: "relative", height: that.size.height, width: that.size.width });
		}
	},

	stop: function() {
		var that = $(this).data("ui-resizable");
		if (that.ghost && that.helper) {
			that.helper.get(0).removeChild(that.ghost.get(0));
		}
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function() {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
			gridX = (grid[0]||1),
			gridY = (grid[1]||1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth = newWidth + gridX;
		}
		if (isMinHeight) {
			newHeight = newHeight + gridY;
		}
		if (isMaxWidth) {
			newWidth = newWidth - gridX;
		}
		if (isMaxHeight) {
			newHeight = newHeight - gridY;
		}

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/^(ne)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/^(sw)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
			that.position.left = op.left - ox;
		}
	}

});

})(jQuery);







/*!
 * jQuery UI Dialog 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/dialog/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */

(function( $, undefined ) {

var sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.widget( "ui.dialog", {
	version: "1.10.3",
	options: {
		appendTo: "body",
		autoOpen: true,
		buttons: [],
		closeOnEscape: true,
		closeText: "close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: null,
		maxWidth: null,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// Ensure the titlebar is always visible
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// callbacks
		beforeClose: null,
		close: null,
		drag: null,
		dragStart: null,
		dragStop: null,
		focus: null,
		open: null,
		resize: null,
		resizeStart: null,
		resizeStop: null
	},

	_create: function() {
		this.originalCss = {
			display: this.element[0].style.display,
			width: this.element[0].style.width,
			minHeight: this.element[0].style.minHeight,
			maxHeight: this.element[0].style.maxHeight,
			height: this.element[0].style.height
		};
		this.originalPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.originalTitle = this.element.attr("title");
		this.options.title = this.options.title || this.originalTitle;

		this._createWrapper();

		this.element
			.show()
			.removeAttr("title")
			.addClass("ui-dialog-content ui-widget-content")
			.appendTo( this.uiDialog );

		this._createTitlebar();
		this._createButtonPane();

		if ( this.options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( this.options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._isOpen = false;
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;
		if ( element && (element.jquery || element.nodeType) ) {
			return $( element );
		}
		return this.document.find( element || "body" ).eq( 0 );
	},

	_destroy: function() {
		var next,
			originalPosition = this.originalPosition;

		this._destroyOverlay();

		this.element
			.removeUniqueId()
			.removeClass("ui-dialog-content ui-widget-content")
			.css( this.originalCss )
			// Without detaching first, the following becomes really slow
			.detach();

		this.uiDialog.stop( true, true ).remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = originalPosition.parent.children().eq( originalPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[0] !== this.element[0] ) {
			next.before( this.element );
		} else {
			originalPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	disable: $.noop,
	enable: $.noop,

	close: function( event ) {
		var that = this;

		if ( !this._isOpen || this._trigger( "beforeClose", event ) === false ) {
			return;
		}

		this._isOpen = false;
		this._destroyOverlay();

		if ( !this.opener.filter(":focusable").focus().length ) {
			// Hiding a focused element doesn't trigger blur in WebKit
			// so in case we have nothing to focus on, explicitly blur the active element
			// https://bugs.webkit.org/show_bug.cgi?id=47182
			$( this.document[0].activeElement ).blur();
		}

		this._hide( this.uiDialog, this.options.hide, function() {
			that._trigger( "close", event );
		});
	},

	isOpen: function() {
		return this._isOpen;
	},

	moveToTop: function() {
		this._moveToTop();
	},

	_moveToTop: function( event, silent ) {
		var moved = !!this.uiDialog.nextAll(":visible").insertBefore( this.uiDialog ).length;
		if ( moved && !silent ) {
			this._trigger( "focus", event );
		}
		return moved;
	},

	open: function() {
		var that = this;
		if ( this._isOpen ) {
			if ( this._moveToTop() ) {
				this._focusTabbable();
			}
			return;
		}

		this._isOpen = true;
		this.opener = $( this.document[0].activeElement );

		this._size();
		this._position();
		this._createOverlay();
		this._moveToTop( null, true );
		this._show( this.uiDialog, this.options.show, function() {
			that._focusTabbable();
			that._trigger("focus");
		});

		this._trigger("open");
	},

	_focusTabbable: function() {
		// Set focus to the first match:
		// 1. First element inside the dialog matching [autofocus]
		// 2. Tabbable element inside the content element
		// 3. Tabbable element inside the buttonpane
		// 4. The close button
		// 5. The dialog itself
		var hasFocus = this.element.find("[autofocus]");
		if ( !hasFocus.length ) {
			hasFocus = this.element.find(":tabbable");
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find(":tabbable");
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
		}
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialog;
		}
		hasFocus.eq( 0 ).focus();
	},

	_keepFocus: function( event ) {
		function checkFocus() {
			var activeElement = this.document[0].activeElement,
				isActive = this.uiDialog[0] === activeElement ||
					$.contains( this.uiDialog[0], activeElement );
			if ( !isActive ) {
				this._focusTabbable();
			}
		}
		event.preventDefault();
		checkFocus.call( this );
		// support: IE
		// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
		// so we check again later
		this._delay( checkFocus );
	},

	_createWrapper: function() {
		this.uiDialog = $("<div>")
			.addClass( "ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " +
				this.options.dialogClass )
			.hide()
			.attr({
				// Setting tabIndex makes the div focusable
				tabIndex: -1,
				role: "dialog"
			})
			.appendTo( this._appendTo() );

		this._on( this.uiDialog, {
			keydown: function( event ) {
				if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE ) {
					event.preventDefault();
					this.close( event );
					return;
				}

				// prevent tabbing out of dialogs
				if ( event.keyCode !== $.ui.keyCode.TAB ) {
					return;
				}
				var tabbables = this.uiDialog.find(":tabbable"),
					first = tabbables.filter(":first"),
					last  = tabbables.filter(":last");

				if ( ( event.target === last[0] || event.target === this.uiDialog[0] ) && !event.shiftKey ) {
					first.focus( 1 );
					event.preventDefault();
				} else if ( ( event.target === first[0] || event.target === this.uiDialog[0] ) && event.shiftKey ) {
					last.focus( 1 );
					event.preventDefault();
				}
			},
			mousedown: function( event ) {
				if ( this._moveToTop( event ) ) {
					this._focusTabbable();
				}
			}
		});

		// We assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if ( !this.element.find("[aria-describedby]").length ) {
			this.uiDialog.attr({
				"aria-describedby": this.element.uniqueId().attr("id")
			});
		}
	},

	_createTitlebar: function() {
		var uiDialogTitle;

		this.uiDialogTitlebar = $("<div>")
			.addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix")
			.prependTo( this.uiDialog );
		this._on( this.uiDialogTitlebar, {
			mousedown: function( event ) {
				// Don't prevent click on close button (#8838)
				// Focusing a dialog that is partially scrolled out of view
				// causes the browser to scroll it into view, preventing the click event
				if ( !$( event.target ).closest(".ui-dialog-titlebar-close") ) {
					// Dialog isn't getting focus when dragging (#8063)
					this.uiDialog.focus();
				}
			}
		});

		this.uiDialogTitlebarClose = $("<button></button>")
			.button({
				label: this.options.closeText,
				icons: {
					primary: "ui-icon-closethick"
				},
				text: false
			})
			.addClass("ui-dialog-titlebar-close")
			.appendTo( this.uiDialogTitlebar );
		this._on( this.uiDialogTitlebarClose, {
			click: function( event ) {
				event.preventDefault();
				this.close( event );
			}
		});

		uiDialogTitle = $("<span>")
			.uniqueId()
			.addClass("ui-dialog-title")
			.prependTo( this.uiDialogTitlebar );
		this._title( uiDialogTitle );

		this.uiDialog.attr({
			"aria-labelledby": uiDialogTitle.attr("id")
		});
	},

	_title: function( title ) {
		if ( !this.options.title ) {
			title.html("&#160;");
		}
		title.text( this.options.title );
	},

	_createButtonPane: function() {
		this.uiDialogButtonPane = $("<div>")
			.addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");

		this.uiButtonSet = $("<div>")
			.addClass("ui-dialog-buttonset")
			.appendTo( this.uiDialogButtonPane );

		this._createButtons();
	},

	_createButtons: function() {
		var that = this,
			buttons = this.options.buttons;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( $.isEmptyObject( buttons ) || ($.isArray( buttons ) && !buttons.length) ) {
			this.uiDialog.removeClass("ui-dialog-buttons");
			return;
		}

		$.each( buttons, function( name, props ) {
			var click, buttonOptions;
			props = $.isFunction( props ) ?
				{ click: props, text: name } :
				props;
			// Default to a non-submitting button
			props = $.extend( { type: "button" }, props );
			// Change the context for the click callback to be the main element
			click = props.click;
			props.click = function() {
				click.apply( that.element[0], arguments );
			};
			buttonOptions = {
				icons: props.icons,
				text: props.showText
			};
			delete props.icons;
			delete props.showText;
			$( "<button></button>", props )
				.button( buttonOptions )
				.appendTo( that.uiButtonSet );
		});
		this.uiDialog.addClass("ui-dialog-buttons");
		this.uiDialogButtonPane.appendTo( this.uiDialog );
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this ).addClass("ui-dialog-dragging");
				that._blockFrames();
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this ).removeClass("ui-dialog-dragging");
				that._unblockFrames();
				that._trigger( "dragStop", event, filteredUi( ui ) );
			}
		});
	},

	_makeResizable: function() {
		var that = this,
			options = this.options,
			handles = options.resizable,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css("position"),
			resizeHandles = typeof handles === "string" ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass("ui-dialog-resizing");
				that._blockFrames();
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.height = $( this ).height();
				options.width = $( this ).width();
				$( this ).removeClass("ui-dialog-resizing");
				that._unblockFrames();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
			}
		})
		.css( "position", position );
	},

	_minHeight: function() {
		var options = this.options;

		return options.height === "auto" ?
			options.minHeight :
			Math.min( options.minHeight, options.height );
	},

	_position: function() {
		// Need to show the dialog to get the actual offset in the position plugin
		var isVisible = this.uiDialog.is(":visible");
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( this.options.position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resize = false,
			resizableOptions = {};

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
			this._position();
		}
		if ( this.uiDialog.is(":data(ui-resizable)") ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		/*jshint maxcomplexity:15*/
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		if ( key === "dialogClass" ) {
			uiDialog
				.removeClass( this.options.dialogClass )
				.addClass( value );
		}

		if ( key === "disabled" ) {
			return;
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.uiDialog.appendTo( this._appendTo() );
		}

		if ( key === "buttons" ) {
			this._createButtons();
		}

		if ( key === "closeText" ) {
			this.uiDialogTitlebarClose.button({
				// Ensure that we always pass a string
				label: "" + value
			});
		}

		if ( key === "draggable" ) {
			isDraggable = uiDialog.is(":data(ui-draggable)");
			if ( isDraggable && !value ) {
				uiDialog.draggable("destroy");
			}

			if ( !isDraggable && value ) {
				this._makeDraggable();
			}
		}

		if ( key === "position" ) {
			this._position();
		}

		if ( key === "resizable" ) {
			// currently resizable, becoming non-resizable
			isResizable = uiDialog.is(":data(ui-resizable)");
			if ( isResizable && !value ) {
				uiDialog.resizable("destroy");
			}

			// currently resizable, changing handles
			if ( isResizable && typeof value === "string" ) {
				uiDialog.resizable( "option", "handles", value );
			}

			// currently non-resizable, becoming resizable
			if ( !isResizable && value !== false ) {
				this._makeResizable();
			}
		}

		if ( key === "title" ) {
			this._title( this.uiDialogTitlebar.find(".ui-dialog-title") );
		}
	},

	_size: function() {
		// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var nonContentHeight, minContentHeight, maxContentHeight,
			options = this.options;

		// Reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			maxHeight: "none",
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		maxContentHeight = typeof options.maxHeight === "number" ?
			Math.max( 0, options.maxHeight - nonContentHeight ) :
			"none";

		if ( options.height === "auto" ) {
			this.element.css({
				minHeight: minContentHeight,
				maxHeight: maxContentHeight,
				height: "auto"
			});
		} else {
			this.element.height( Math.max( 0, options.height - nonContentHeight ) );
		}

		if (this.uiDialog.is(":data(ui-resizable)") ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	},

	_blockFrames: function() {
		this.iframeBlocks = this.document.find( "iframe" ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css({
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight()
				})
				.appendTo( iframe.parent() )
				.offset( iframe.offset() )[0];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_allowInteraction: function( event ) {
		if ( $( event.target ).closest(".ui-dialog").length ) {
			return true;
		}

		// TODO: Remove hack when datepicker implements
		// the .ui-front logic (#8989)
		return !!$( event.target ).closest(".ui-datepicker").length;
	},

	_createOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		var that = this,
			widgetFullName = this.widgetFullName;
		if ( !$.ui.dialog.overlayInstances ) {
			// Prevent use of anchors and inputs.
			// We use a delay in case the overlay is created from an
			// event that we're going to be cancelling. (#2804)
			this._delay(function() {
				// Handle .dialog().dialog("close") (#4065)
				if ( $.ui.dialog.overlayInstances ) {
					this.document.bind( "focusin.dialog", function( event ) {
						if ( !that._allowInteraction( event ) ) {
							event.preventDefault();
							$(".ui-dialog:visible:last .ui-dialog-content")
								.data( widgetFullName )._focusTabbable();
						}
					});
				}
			});
		}

		this.overlay = $("<div>")
			.addClass("ui-widget-overlay ui-front")
			.appendTo( this._appendTo() );
		this._on( this.overlay, {
			mousedown: "_keepFocus"
		});
		$.ui.dialog.overlayInstances++;
	},

	_destroyOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}

		if ( this.overlay ) {
			$.ui.dialog.overlayInstances--;

			if ( !$.ui.dialog.overlayInstances ) {
				this.document.unbind( "focusin.dialog" );
			}
			this.overlay.remove();
			this.overlay = null;
		}
	}
});

$.ui.dialog.overlayInstances = 0;

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// position option with array notation
	// just override with old implementation
	$.widget( "ui.dialog", $.ui.dialog, {
		_position: function() {
			var position = this.options.position,
				myAt = [],
				offset = [ 0, 0 ],
				isVisible;

			if ( position ) {
				if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
					myAt = position.split ? position.split(" ") : [ position[0], position[1] ];
					if ( myAt.length === 1 ) {
						myAt[1] = myAt[0];
					}

					$.each( [ "left", "top" ], function( i, offsetPosition ) {
						if ( +myAt[ i ] === myAt[ i ] ) {
							offset[ i ] = myAt[ i ];
							myAt[ i ] = offsetPosition;
						}
					});

					position = {
						my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
							myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
						at: myAt.join(" ")
					};
				}

				position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
			} else {
				position = $.ui.dialog.prototype.options.position;
			}

			// need to show the dialog to get the actual offset in the position plugin
			isVisible = this.uiDialog.is(":visible");
			if ( !isVisible ) {
				this.uiDialog.show();
			}
			this.uiDialog.position( position );
			if ( !isVisible ) {
				this.uiDialog.hide();
			}
		}
	});
}

}( jQuery ) );
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);













(function() {
  var CSRFToken, anchoredLink, assetsChanged, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, extractTrackAssets, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, initialized, installClickHandlerLast, intersection, invalidContent, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberInitialPage, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initialized = false;

  currentState = null;

  referer = document.location.href;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  visit = function(url) {
    if (browserSupportsPushState && browserIsntBuggy) {
      cacheCurrentPage();
      reflectNewUrl(url);
      return fetchReplacement(url);
    } else {
      return document.location.href = url;
    }
  };

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = (function(_this) {
      return function() {
        var doc;
        triggerEvent('page:receive');
        if (invalidContent(xhr) || assetsChanged((doc = createDocument(xhr.responseText)))) {
          return document.location.reload();
        } else {
          changePage.apply(null, extractTitleAndBody(doc));
          reflectRedirectedUrl(xhr);
          if (document.location.hash) {
            document.location.href = document.location.href;
          } else {
            resetScrollPosition();
          }
          return triggerEvent('page:load');
        }
      };
    })(this);
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(state) {
    var page;
    cacheCurrentPage();
    if (page = pageCache[state.position]) {
      if (xhr != null) {
        xhr.abort();
      }
      changePage(page.title, page.body);
      recallScrollPosition(page);
      return triggerEvent('page:restore');
    } else {
      return fetchReplacement(document.location.href);
    }
  };

  cacheCurrentPage = function() {
    rememberInitialPage();
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(10);
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.getElementsByTagName('script'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== document.location.href) {
      referer = document.location.href;
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function(xhr) {
    var location;
    if ((location = xhr.getResponseHeader('X-XHR-Current-Location')) && location !== document.location.pathname + document.location.search) {
      return window.history.replaceState(currentState, '', location + document.location.hash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  rememberInitialPage = function() {
    if (!initialized) {
      rememberCurrentUrl();
      rememberCurrentState();
      createDocument = browserCompatibleDocumentParser();
      return initialized = true;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  invalidContent = function(xhr) {
    return !xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
  };

  extractTrackAssets = function(doc) {
    var node, _i, _len, _ref1, _results;
    _ref1 = doc.head.childNodes;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      node = _ref1[_i];
      if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
        _results.push(node.src || node.href);
      }
    }
    return _results;
  };

  assetsChanged = function(doc) {
    var fetchedAssets;
    loadedAssets || (loadedAssets = extractTrackAssets(document));
    fetchedAssets = extractTrackAssets(doc);
    return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
  };

  intersection = function(a, b) {
    var value, _i, _len, _ref1, _results;
    if (a.length > b.length) {
      _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
    }
    _results = [];
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      value = a[_i];
      if (__indexOf.call(b, value) >= 0) {
        _results.push(value);
      }
    }
    return _results;
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        visit(link.href);
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var _ref1;
      if ((_ref1 = event.state) != null ? _ref1.turbolinks : void 0) {
        return fetchHistory(event.state);
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    initializeTurbolinks();
  }

  this.Turbolinks = {
    visit: visit
  };

}).call(this);
(function() {
  var AddSelectItem, DynamicSelectable;

  $.fn.extend({
    dynamicSelectable: function() {
      return $(this).each(function(i, el) {
        return new DynamicSelectable($(el));
      });
    }
  });


  /*      
  $.fn.extend
    addSelectItem: ->
      $(@).each (i, el) ->
        new AddSelectItem($(el))
   */

  DynamicSelectable = (function() {
    function DynamicSelectable($select) {
      this.init($select);
    }

    DynamicSelectable.prototype.init = function($select) {
      this.urlTemplate = $select.data('dynamicSelectableUrl');
      this.$targetSelect = $($select.data('dynamicSelectableTarget'));
      return $select.on('change', (function(_this) {
        return function() {
          var url;
          alert($select.attr("id"));
          alert("@urlTemplate = " + _this.urlTemplate);
          alert(_this.$targetSelect.attr("id"));
          _this.clearTarget();
          url = _this.constructUrl($select.val());
          alert("url = " + url);
          if (url) {
            return $.getJSON(url, function(data) {
              $.each(data, function(index, el) {
                return _this.$targetSelect.append("<option value='" + el.id + "'>" + el.name + "</option>");
              });
              return _this.reinitializeTarget();
            });
          } else {
            return _this.reinitializeTarget();
          }
        };
      })(this));
    };

    DynamicSelectable.prototype.reinitializeTarget = function() {
      return this.$targetSelect.trigger("change");
    };

    DynamicSelectable.prototype.clearTarget = function() {
      return this.$targetSelect.html('<option></option>');
    };

    DynamicSelectable.prototype.constructUrl = function(id) {
      if (id && id !== '') {
        return this.urlTemplate.replace(/:.+_id/, id);
      }
    };

    return DynamicSelectable;

  })();

  AddSelectItem = (function() {
    function AddSelectItem($select) {
      this.init($select);
    }

    AddSelectItem.prototype.init = function($select) {
      this.urlTemplate = $select.data('dynamicSelectableUrl9999');
      this.$targetSelect = $($select.data('dynamicSelectableTarget111'));
      return $select.on('click', (function(_this) {
        return function() {
          var url;
          _this.addSelectBox();
          $("#dialog").dialog({
            autoOpen: false
          });
          $("#dialog").dialog("option", "title", "Loading...").dialog("open");
          url = _this.constructUrl($select.val());
          if (url) {
            return $.getJSON(url, function(data) {
              $.each(data, function(index, el) {
                return _this.$targetSelect.append("<option value='" + el.id + "'>" + el.name + "</option>");
              });
              return _this.reinitializeTarget();
            });
          } else {
            return _this.reinitializeTarget();
          }
        };
      })(this));
    };

    AddSelectItem.prototype.reinitializeTarget = function() {
      return this.$targetSelect.trigger("change");
    };

    AddSelectItem.prototype.clearTarget = function() {
      return this.$targetSelect.html('<option></option>');
    };

    AddSelectItem.prototype.addSelectBox = function() {
      var aurl, fEffectName, fName1, fName2, fType1, fType2, fieldWrapper, intId, removeButton;
      intId = $("[id^='fieldWrapper']").length + 1;
      alert(intId);
      aurl = '/aroma_effect';
      $.ajaxSetup({
        async: false
      });
      if (aurl) {
        $.getJSON(aurl, (function(_this) {
          return function(data) {
            return $.each(data, function(index, el) {
              return _this.options += "<option value='" + el.id + "'>" + el.name + "</option>";
            });
          };
        })(this));
      }
      fieldWrapper = $('<div class=\'row\' id=\'fieldWrapper' + intId + '\'/>');
      fEffectName = $('<div class=\'span2\'> 藥學屬性' + intId + ' </div>');
      fType1 = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' > ' + this.options + ' </select> </div>');
      fType2 = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' ><option value=\'checkbox\'>Checked</option><option value=\'textbox\'>Text</option><option value=\'textarea\'>Paragraph</option></select> </div>');
      fName1 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>');
      fName2 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>');
      removeButton = $('<div class=\'span2\'> <input type=\'button\' class=\'remove\' value=\'-\' /> </div> ');
      fieldWrapper.append(fEffectName);
      fieldWrapper.append(fType1);
      fieldWrapper.append(fType2);
      fieldWrapper.append(fName1);
      fieldWrapper.append(fName2);
      fieldWrapper.append('</div>');
      return $('#addDiv').append(fieldWrapper);
    };

    AddSelectItem.prototype.constructUrl = function(id) {
      if (id && id !== '') {
        return this.urlTemplate.replace(/:.+_id/, id);
      }
    };

    return AddSelectItem;

  })();

}).call(this);
(function() {
  window.initApp = function() {
    return $('select[data-dynamic-selectable-url]').dynamicSelectable();
  };

  document.addEventListener('page:load', initApp);

  $(initApp);

}).call(this);
(function() {
  var addSelectBoxx, addSelectItem, cancel, getResponse, pickEco;

  addSelectItem = function(elem) {
    var aurl, fEffectName, fName1, fName2, fName3, fType1, fieldWrapper, findButton, intId, removeButton;
    intId = $("[id^='fieldWrapper']").length + 1;
    aurl = '/aroma_effect';
    $.ajaxSetup({
      async: false
    });
    if (aurl) {
      $.getJSON(aurl, (function(_this) {
        return function(data) {
          return $.each(data, function(index, el) {
            return _this.options += "<option value='" + el.id + "'>" + el.name + "</option>";
          });
        };
      })(this));
    }
    fieldWrapper = $('<div class=\'row\' id=\'fieldWrapper' + intId + '\'/>');
    fEffectName = $('<div class=\'span2\'> 藥學屬性' + intId + ' </div>');
    fType1 = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' > ' + this.options + ' </select> </div>');
    findButton = $('<div class=\'span1\'><button id=\'findButton' + intId + '\' class=\'btn\'><i class=\'icon-search\'></i></button></div>');
    fName1 = $('<div class=\'span2\'> <input id=\'eco' + intId + '\' type=\'text\'  /> </div>');
    fName2 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>');
    fName3 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>');
    removeButton = $('<div class=\'span2\'> <input type=\'button\' class=\'remove\' value=\'-\' /> </div> ');
    fieldWrapper.append(fEffectName);
    fieldWrapper.append(fType1);
    fieldWrapper.append(findButton);
    fieldWrapper.append(fName1);
    fieldWrapper.append(fName2);
    fieldWrapper.append(fName3);
    fieldWrapper.append('</div>');
    $('#addDiv').append(fieldWrapper);
    return $('#findButton' + intId).on('click', {
      name: '#eco' + intId
    }, (function(_this) {
      return function(e) {
        return pickEco(e);
      };
    })(this));
  };

  addSelectBoxx = function(eco) {
    var dialogOpts;
    dialogOpts = {
      modal: true,
      buttons: {
        "Done": getResponse,
        "Cancel": cancel
      },
      autoOpen: false
    };
    return $("#dialog").data("targetID", eco).dialog(dialogOpts).dialog("open");
  };

  getResponse = function() {
    var answer, targetID;
    targetID = $(this).data("targetID");
    answer = '';
    $("input").each(function() {
      if (this.checked === true) {
        return answer = $(this).val();
      }
    });
    $(targetID).val(answer);
    return $("#dialog").dialog("close");
  };

  cancel = function() {
    return $("#dialog").dialog("close");
  };

  pickEco = (function(_this) {
    return function(e) {
      return addSelectBoxx(e.data.name);
    };
  })(this);

  $(function() {
    return $('#addoils').on('click', function(e) {
      return addSelectItem(e.target);
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
$(function () {

    // Accordion
    $("#accordion").accordion({
        header: "h3"
    });

    // Tabs
    $('#tabs2, #tabs').tabs();

    // Buttons
    $('button').button();

    // Anchors, Submit
    $('.button,#sampleButton').button();

    // Buttonset
    $('#radioset').buttonset();
    $("#format").buttonset();


    // Dialog
    $('#dialog').dialog({
        autoOpen: false,
        width: 600,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });

    // Dialog Link
    $('#dialog_link').click(function () {
        $('#dialog').dialog('open');
        return false;
    });

    // Modal Link
    $('#modal_link').click(function () {
        $('#dialog-message').dialog('open');
        return false;
    });

    // Datepicker
    $('#datepicker').datepicker({
        inline: true
    });

    // Slider
    $('#slider').slider({
        range: true,
        values: [17, 67]
    });

    // Progressbar
    $("#progressbar").progressbar({
        value: 20
    });

    //hover states on the static widgets
    $('#dialog_link, #modal_link, ul#icons li').hover(

    function () {
        $(this).addClass('ui-state-hover');
    }, function () {
        $(this).removeClass('ui-state-hover');
    });

    // Autocomplete
    var availableTags = ["ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme"];

    $("#tags").autocomplete({
        source: availableTags
    });


    // Dialogs
    $("#dialog-message").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });


    // Remove focus from buttons
    $('.ui-dialog :button').blur();



    // Vertical slider
    $("#slider-vertical").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 60,
        slide: function (event, ui) {
            $("#amount").val(ui.value);
        }
    });
    $("#amount").val($("#slider-vertical").slider("value"));


    // Split button
    $("#rerun").button().click(function () {
        alert("Running the last action");
    }).next().button({
        text: false,
        icons: {
            primary: "ui-icon-triangle-1-s"
        }
    }).click(function () {
        alert("Could display a menu to select an action");
    }).parent().buttonset();


    var $tab_title_input = $("#tab_title"),
        $tab_content_input = $("#tab_content");
    var tab_counter = 2;

    // tabs init with a custom tab template and an "add" callback filling in the content
    var $tabs = $("#tabs2").tabs({
        tabTemplate: "<li><a href='#{href}'>#{label}</a></li>",
        add: function (event, ui) {
            var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
            $(ui.panel).append("<p>" + tab_content + "</p>");
        }
    });

    // modal dialog init: custom buttons and a "close" callback reseting the form inside
    var $dialog = $("#dialog2").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Add: function () {
                addTab();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        open: function () {
            $tab_title_input.focus();
        },
        close: function () {
            $form[0].reset();
        }
    });

    // addTab form: calls addTab function on submit and closes the dialog
    var $form = $("form", $dialog).submit(function () {
        addTab();
        $dialog.dialog("close");
        return false;
    });

    // actual addTab function: adds new tab using the title input from the form above


    function addTab() {
        var tab_title = $tab_title_input.val() || "Tab " + tab_counter;
        $tabs.tabs("add", "#tabs-" + tab_counter, tab_title);
        tab_counter++;
    }

    // addTab button: just opens the dialog
    $("#add_tab").button().click(function () {
        $dialog.dialog("open");
    });

    // close icon: removing the tab on click
    // note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
    $("#tabs span.ui-icon-close").live("click", function () {
        var index = $("li", $tabs).index($(this).parent());
        $tabs.tabs("remove", index);
    });

    // Filament datepicker
    $('#rangeA').daterangepicker();
    $('#rangeBa, #rangeBb').daterangepicker();


    // Dynamic tabs
    var $tab_title_input = $("#tab_title"),
        $tab_content_input = $("#tab_content");
    var tab_counter = 2;

    // tabs init with a custom tab template and an "add" callback filling in the content
    var $tabs = $("#tabs2").tabs({
        tabTemplate: "<li><a href='#{href}'>#{label}</a></li>",
        add: function (event, ui) {
            var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
            $(ui.panel).append("<p>" + tab_content + "</p>");
        }
    });

    // modal dialog init: custom buttons and a "close" callback reseting the form inside
    var $dialog = $("#dialog2").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Add: function () {
                addTab();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        open: function () {
            $tab_title_input.focus();
        },
        close: function () {
            $form[0].reset();
        }
    });

    // addTab form: calls addTab function on submit and closes the dialog
    var $form = $("form", $dialog).submit(function () {
        addTab();
        $dialog.dialog("close");
        return false;
    });

    // actual addTab function: adds new tab using the title input from the form above

    function addTab() {
        var tab_title = $tab_title_input.val() || "Tab " + tab_counter;
        $tabs.tabs("add", "#tabs-" + tab_counter, tab_title);
        tab_counter++;
    }

    // addTab button: just opens the dialog
    $("#add_tab").button().click(function () {
        $dialog.dialog("open");
    });

    // close icon: removing the tab on click
    // note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
    $("#tabs span.ui-icon-close").live("click", function () {
        var index = $("li", $tabs).index($(this).parent());
        $tabs.tabs("remove", index);
    });


    // File input (using http://filamentgroup.com/lab/jquery_custom_file_input_book_designing_with_progressive_enhancement/)
    $('#file').customFileInput({
        button_position : 'right'
    });


    //Wijmo
    $("#menu1").wijmenu({ trigger: ".wijmo-wijmenu-item", triggerEvent: "click" });
    //$(".wijmo-wijmenu-text").parent().bind("click", function () {
    //    $("#menu1").wijmenu("hideAllMenus");
    //});
    //$(".wijmo-wijmenu-link").hover(function () {
    //    $(this).addClass("ui-state-hover");
    //}, function () {
    //    $(this).removeClass("ui-state-hover");
    //});

    //Toolbar
    $("#play, #shuffle").button();
    $("#repeat").buttonset();


});
/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */

Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};


/**
 * @version: 1.0 Alpha-1
 * @author: Coolite Inc. http://www.coolite.com/
 * @date: 2008-04-13
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * @website: http://www.datejs.com/
 */
 
/* 
 * TimeSpan(milliseconds);
 * TimeSpan(days, hours, minutes, seconds);
 * TimeSpan(days, hours, minutes, seconds, milliseconds);
 */
var TimeSpan = function (days, hours, minutes, seconds, milliseconds) {
	var attrs = "days hours minutes seconds milliseconds".split(/\s+/);
	
	var gFn = function (attr) { 
		return function () { 
			return this[attr]; 
		}; 
	};
	
	var sFn = function (attr) { 
		return function (val) { 
			this[attr] = val; 
			return this; 
		}; 
	};
	
	for (var i = 0; i < attrs.length ; i++) {
		var $a = attrs[i], $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
		TimeSpan.prototype[$a] = 0;
		TimeSpan.prototype["get" + $b] = gFn($a);
		TimeSpan.prototype["set" + $b] = sFn($a);
	}

	if (arguments.length == 4) { 
		this.setDays(days); 
		this.setHours(hours); 
		this.setMinutes(minutes); 
		this.setSeconds(seconds); 
	} else if (arguments.length == 5) { 
		this.setDays(days); 
		this.setHours(hours); 
		this.setMinutes(minutes); 
		this.setSeconds(seconds); 
		this.setMilliseconds(milliseconds); 
	} else if (arguments.length == 1 && typeof days == "number") {
		var orient = (days < 0) ? -1 : +1;
		this.setMilliseconds(Math.abs(days));
		
		this.setDays(Math.floor(this.getMilliseconds() / 86400000) * orient);
		this.setMilliseconds(this.getMilliseconds() % 86400000);

		this.setHours(Math.floor(this.getMilliseconds() / 3600000) * orient);
		this.setMilliseconds(this.getMilliseconds() % 3600000);

		this.setMinutes(Math.floor(this.getMilliseconds() / 60000) * orient);
		this.setMilliseconds(this.getMilliseconds() % 60000);

		this.setSeconds(Math.floor(this.getMilliseconds() / 1000) * orient);
		this.setMilliseconds(this.getMilliseconds() % 1000);

		this.setMilliseconds(this.getMilliseconds() * orient);
	}

	this.getTotalMilliseconds = function () {
		return (this.getDays() * 86400000) + (this.getHours() * 3600000) + (this.getMinutes() * 60000) + (this.getSeconds() * 1000); 
	};
	
	this.compareTo = function (time) {
		var t1 = new Date(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds()), t2;
		if (time === null) { 
			t2 = new Date(1970, 1, 1, 0, 0, 0); 
		}
		else {
			t2 = new Date(1970, 1, 1, time.getHours(), time.getMinutes(), time.getSeconds());
		}
		return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
	};

	this.equals = function (time) {
		return (this.compareTo(time) === 0);
	};    

	this.add = function (time) { 
		return (time === null) ? this : this.addSeconds(time.getTotalMilliseconds() / 1000); 
	};

	this.subtract = function (time) { 
		return (time === null) ? this : this.addSeconds(-time.getTotalMilliseconds() / 1000); 
	};

	this.addDays = function (n) { 
		return new TimeSpan(this.getTotalMilliseconds() + (n * 86400000)); 
	};

	this.addHours = function (n) { 
		return new TimeSpan(this.getTotalMilliseconds() + (n * 3600000)); 
	};

	this.addMinutes = function (n) { 
		return new TimeSpan(this.getTotalMilliseconds() + (n * 60000)); 
	};

	this.addSeconds = function (n) {
		return new TimeSpan(this.getTotalMilliseconds() + (n * 1000)); 
	};

	this.addMilliseconds = function (n) {
		return new TimeSpan(this.getTotalMilliseconds() + n); 
	};

	this.get12HourHour = function () {
		return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
	};

	this.getDesignator = function () { 
		return (this.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
	};

	this.toString = function (format) {
		this._toString = function () {
			if (this.getDays() !== null && this.getDays() > 0) {
				return this.getDays() + "." + this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
			}
			else { 
				return this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
			}
		};
		
		this.p = function (s) {
			return (s.toString().length < 2) ? "0" + s : s;
		};
		
		var me = this;
		
		return format ? format.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g, 
		function (format) {
			switch (format) {
			case "d":	
				return me.getDays();
			case "dd":	
				return me.p(me.getDays());
			case "H":	
				return me.getHours();
			case "HH":	
				return me.p(me.getHours());
			case "h":	
				return me.get12HourHour();
			case "hh":	
				return me.p(me.get12HourHour());
			case "m":	
				return me.getMinutes();
			case "mm":	
				return me.p(me.getMinutes());
			case "s":	
				return me.getSeconds();
			case "ss":	
				return me.p(me.getSeconds());
			case "t":	
				return ((me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator).substring(0, 1);
			case "tt":	
				return (me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
			}
		}
		) : this._toString();
	};
	return this;
};    

/**
 * Gets the time of day for this date instances. 
 * @return {TimeSpan} TimeSpan
 */
Date.prototype.getTimeOfDay = function () {
	return new TimeSpan(0, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};

/* 
 * TimePeriod(startDate, endDate);
 * TimePeriod(years, months, days, hours, minutes, seconds, milliseconds);
 */
var TimePeriod = function (years, months, days, hours, minutes, seconds, milliseconds) {
	var attrs = "years months days hours minutes seconds milliseconds".split(/\s+/);
	
	var gFn = function (attr) { 
		return function () { 
			return this[attr]; 
		}; 
	};
	
	var sFn = function (attr) { 
		return function (val) { 
			this[attr] = val; 
			return this; 
		}; 
	};
	
	for (var i = 0; i < attrs.length ; i++) {
		var $a = attrs[i], $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
		TimePeriod.prototype[$a] = 0;
		TimePeriod.prototype["get" + $b] = gFn($a);
		TimePeriod.prototype["set" + $b] = sFn($a);
	}
	
	if (arguments.length == 7) { 
		this.years = years;
		this.months = months;
		this.setDays(days);
		this.setHours(hours); 
		this.setMinutes(minutes); 
		this.setSeconds(seconds); 
		this.setMilliseconds(milliseconds);
	} else if (arguments.length == 2 && arguments[0] instanceof Date && arguments[1] instanceof Date) {
		// startDate and endDate as arguments
	
		var d1 = years.clone();
		var d2 = months.clone();
	
		var temp = d1.clone();
		var orient = (d1 > d2) ? -1 : +1;
		
		this.years = d2.getFullYear() - d1.getFullYear();
		temp.addYears(this.years);
		
		if (orient == +1) {
			if (temp > d2) {
				if (this.years !== 0) {
					this.years--;
				}
			}
		} else {
			if (temp < d2) {
				if (this.years !== 0) {
					this.years++;
				}
			}
		}
		
		d1.addYears(this.years);

		if (orient == +1) {
			while (d1 < d2 && d1.clone().addDays(Date.getDaysInMonth(d1.getYear(), d1.getMonth()) ) < d2) {
				d1.addMonths(1);
				this.months++;
			}
		}
		else {
			while (d1 > d2 && d1.clone().addDays(-d1.getDaysInMonth()) > d2) {
				d1.addMonths(-1);
				this.months--;
			}
		}
		
		var diff = d2 - d1;

		if (diff !== 0) {
			var ts = new TimeSpan(diff);
			this.setDays(ts.getDays());
			this.setHours(ts.getHours());
			this.setMinutes(ts.getMinutes());
			this.setSeconds(ts.getSeconds());
			this.setMilliseconds(ts.getMilliseconds());
		}
	}
	return this;
};
/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "daterangepicker.jQuery.js"
 * by Scott Jehl, scott@filamentgroup.com
 * reference article: http://www.filamentgroup.com/lab/update_date_range_picker_with_jquery_ui/
 * demo page: http://www.filamentgroup.com/examples/daterangepicker/
 * 
 * Copyright (c) 2010 Filament Group, Inc
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 *
 * Dependencies: jquery, jquery UI datepicker, date.js, jQuery UI CSS Framework
 
 *  12.15.2010 Made some fixes to resolve breaking changes introduced by jQuery UI 1.8.7
 * --------------------------------------------------------------------
 */

jQuery.fn.daterangepicker = function(settings){
	var rangeInput = jQuery(this);
	
	//defaults
	var options = jQuery.extend({
		presetRanges: [
			{text: 'Today', dateStart: 'today', dateEnd: 'today' },
			{text: 'Last 7 days', dateStart: 'today-7days', dateEnd: 'today' },
			{text: 'Month to date', dateStart: function(){ return Date.parse('today').moveToFirstDayOfMonth();  }, dateEnd: 'today' },
			{text: 'Year to date', dateStart: function(){ var x= Date.parse('today'); x.setMonth(0); x.setDate(1); return x; }, dateEnd: 'today' },
			//extras:
			{text: 'The previous Month', dateStart: function(){ return Date.parse('1 month ago').moveToFirstDayOfMonth();  }, dateEnd: function(){ return Date.parse('1 month ago').moveToLastDayOfMonth();  } }
			//{text: 'Tomorrow', dateStart: 'Tomorrow', dateEnd: 'Tomorrow' },
			//{text: 'Ad Campaign', dateStart: '03/07/08', dateEnd: 'Today' },
			//{text: 'Last 30 Days', dateStart: 'Today-30', dateEnd: 'Today' },
			//{text: 'Next 30 Days', dateStart: 'Today', dateEnd: 'Today+30' },
			//{text: 'Our Ad Campaign', dateStart: '03/07/08', dateEnd: '07/08/08' }
		], 
		//presetRanges: array of objects for each menu preset. 
		//Each obj must have text, dateStart, dateEnd. dateStart, dateEnd accept date.js string or a function which returns a date object
		presets: {
			specificDate: 'Specific Date', 
			allDatesBefore: 'All Dates Before', 
			allDatesAfter: 'All Dates After', 
			dateRange: 'Date Range'
		},
		rangeStartTitle: 'Start date',
		rangeEndTitle: 'End date',
		nextLinkText: 'Next',
		prevLinkText: 'Prev',
		doneButtonText: 'Done',
		earliestDate: Date.parse('-15years'), //earliest date allowed 
		latestDate: Date.parse('+15years'), //latest date allowed 
		constrainDates: false,
		rangeSplitter: '-', //string to use between dates in single input
		dateFormat: 'm/d/yy', // date formatting. Available formats: http://docs.jquery.com/UI/Datepicker/%24.datepicker.formatDate
		closeOnSelect: true, //if a complete selection is made, close the menu
		arrows: false,
		appendTo: 'body',
		onClose: function(){},
		onOpen: function(){},
		onChange: function(){},
		datepickerOptions: null //object containing native UI datepicker API options
	}, settings);
	
	

	//custom datepicker options, extended by options
	var datepickerOptions = {
		onSelect: function(dateText, inst) { 
				$(this).trigger('constrainOtherPicker');
				
				var rangeA = fDate( rp.find('.range-start').datepicker('getDate') );
				var rangeB = fDate( rp.find('.range-end').datepicker('getDate') );
				
				if(rp.find('.ui-daterangepicker-specificDate').is('.ui-state-active')){
		                    rangeB = rangeA;
		                }

				//send back to input or inputs
				if(rangeInput.length == 2){
					rangeInput.eq(0).val(rangeA);
					rangeInput.eq(1).val(rangeB);
				}
				else{
					rangeInput.val((rangeA != rangeB) ? rangeA+' '+ options.rangeSplitter +' '+rangeB : rangeA);
				}
				//if closeOnSelect is true
				if(options.closeOnSelect){
					if(!rp.find('li.ui-state-active').is('.ui-daterangepicker-dateRange') && !rp.is(':animated') ){
						hideRP();
					}
				}	
				options.onChange();			
			},
			defaultDate: +0
	};
	
	//change event fires both when a calendar is updated or a change event on the input is triggered
	rangeInput.bind('change', options.onChange);
	
	//datepicker options from options
	options.datepickerOptions = (settings) ? jQuery.extend(datepickerOptions, settings.datepickerOptions) : datepickerOptions;
	
	//Capture Dates from input(s)
	var inputDateA, inputDateB = Date.parse('today');
	var inputDateAtemp, inputDateBtemp;
	if(rangeInput.size() == 2){
		inputDateAtemp = Date.parse( rangeInput.eq(0).val() );
		inputDateBtemp = Date.parse( rangeInput.eq(1).val() );
		if(inputDateAtemp == null){inputDateAtemp = inputDateBtemp;} 
		if(inputDateBtemp == null){inputDateBtemp = inputDateAtemp;} 
	}
	else {
		//if(rangeInput.val()){
			inputDateAtemp = Date.parse( rangeInput.val().split(options.rangeSplitter)[0] );
			inputDateBtemp = Date.parse( rangeInput.val().split(options.rangeSplitter)[1] );
			if(inputDateBtemp == null){inputDateBtemp = inputDateAtemp;} //if one date, set both
		//}
	}
	if(inputDateAtemp != null){inputDateA = inputDateAtemp;}
	if(inputDateBtemp != null){inputDateB = inputDateBtemp;}

		
	//build picker and 
	var rp = jQuery('<div class="ui-daterangepicker ui-widget ui-helper-clearfix ui-widget-content ui-corner-all"></div>');
	var rpPresets = (function(){
		var ul = jQuery('<ul class="ui-widget-content"></ul>').appendTo(rp);
		jQuery.each(options.presetRanges,function(){
			jQuery('<li class="ui-daterangepicker-'+ this.text.replace(/ /g, '') +' ui-corner-all"><a href="#">'+ this.text +'</a></li>')
			.data('dateStart', this.dateStart)
			.data('dateEnd', this.dateEnd)
			.appendTo(ul);
		});
		var x=0;
		jQuery.each(options.presets, function(key, value) {
			jQuery('<li class="ui-daterangepicker-'+ key +' preset_'+ x +' ui-helper-clearfix ui-corner-all"><span class="ui-icon ui-icon-triangle-1-e"></span><a href="#">'+ value +'</a></li>')
			.appendTo(ul);
			x++;
		});
		
		ul.find('li').hover(
				function(){
					jQuery(this).addClass('ui-state-hover');
				},
				function(){
					jQuery(this).removeClass('ui-state-hover');
				})
			.click(function(){
				rp.find('.ui-state-active').removeClass('ui-state-active');
				jQuery(this).addClass('ui-state-active');
				clickActions(jQuery(this),rp, rpPickers, doneBtn);
				return false;
			});
		return ul;
	})();
				
	//function to format a date string        
	function fDate(date){
	   if(date == null || !date.getDate()){return '';}
	   var day = date.getDate();
	   var month = date.getMonth();
	   var year = date.getFullYear();
	   month++; // adjust javascript month
	   var dateFormat = options.dateFormat;
	   return jQuery.datepicker.formatDate( dateFormat, date ); 
	}
	
	
	jQuery.fn.restoreDateFromData = function(){
		if(jQuery(this).data('saveDate')){
			jQuery(this).datepicker('setDate', jQuery(this).data('saveDate')).removeData('saveDate'); 
		}
		return this;
	}
	jQuery.fn.saveDateToData = function(){
		if(!jQuery(this).data('saveDate')){
			jQuery(this).data('saveDate', jQuery(this).datepicker('getDate') );
		}
		return this;
	}
	
	//show, hide, or toggle rangepicker
	function showRP(){
		if(rp.data('state') == 'closed'){ 
			positionRP();
			rp.fadeIn(300).data('state', 'open');
			options.onOpen(); 
		}
	}
	function hideRP(){
		if(rp.data('state') == 'open'){ 
			rp.fadeOut(300).data('state', 'closed');
			options.onClose(); 
		}
	}
	function toggleRP(){
		if( rp.data('state') == 'open' ){ hideRP(); }
		else { showRP(); }
	}
	function positionRP(){
		var relEl = riContain || rangeInput; //if arrows, use parent for offsets
		var riOffset = relEl.offset(),
			side = 'left',
			val = riOffset.left,
			offRight = jQuery(window).width() - val - relEl.outerWidth();

		if(val > offRight){
			side = 'right', val =  offRight;
		}
		
		rp.parent().css(side, val).css('top', riOffset.top + relEl.outerHeight());
	}
	
	
					
	//preset menu click events	
	function clickActions(el, rp, rpPickers, doneBtn){
		
		if(el.is('.ui-daterangepicker-specificDate')){
			//Specific Date (show the "start" calendar)
			doneBtn.hide();
			rpPickers.show();
			rp.find('.title-start').text( options.presets.specificDate );
			rp.find('.range-start').restoreDateFromData().css('opacity',1).show(400);
			rp.find('.range-end').restoreDateFromData().css('opacity',0).hide(400);
			setTimeout(function(){doneBtn.fadeIn();}, 400);
		}
		else if(el.is('.ui-daterangepicker-allDatesBefore')){
			//All dates before specific date (show the "end" calendar and set the "start" calendar to the earliest date)
			doneBtn.hide();
			rpPickers.show();
			rp.find('.title-end').text( options.presets.allDatesBefore );
			rp.find('.range-start').saveDateToData().datepicker('setDate', options.earliestDate).css('opacity',0).hide(400);
			rp.find('.range-end').restoreDateFromData().css('opacity',1).show(400);
			setTimeout(function(){doneBtn.fadeIn();}, 400);
		}
		else if(el.is('.ui-daterangepicker-allDatesAfter')){
			//All dates after specific date (show the "start" calendar and set the "end" calendar to the latest date)
			doneBtn.hide();
			rpPickers.show();
			rp.find('.title-start').text( options.presets.allDatesAfter );
			rp.find('.range-start').restoreDateFromData().css('opacity',1).show(400);
			rp.find('.range-end').saveDateToData().datepicker('setDate', options.latestDate).css('opacity',0).hide(400);
			setTimeout(function(){doneBtn.fadeIn();}, 400);
		}
		else if(el.is('.ui-daterangepicker-dateRange')){
			//Specific Date range (show both calendars)
			doneBtn.hide();
			rpPickers.show();
			rp.find('.title-start').text(options.rangeStartTitle);
			rp.find('.title-end').text(options.rangeEndTitle);
			rp.find('.range-start').restoreDateFromData().css('opacity',1).show(400);
			rp.find('.range-end').restoreDateFromData().css('opacity',1).show(400);
			setTimeout(function(){doneBtn.fadeIn();}, 400);
		}
		else {
			//custom date range specified in the options (no calendars shown)
			doneBtn.hide();
			rp.find('.range-start, .range-end').css('opacity',0).hide(400, function(){
				rpPickers.hide();
			});
			var dateStart = (typeof el.data('dateStart') == 'string') ? Date.parse(el.data('dateStart')) : el.data('dateStart')();
			var dateEnd = (typeof el.data('dateEnd') == 'string') ? Date.parse(el.data('dateEnd')) : el.data('dateEnd')();
			rp.find('.range-start').datepicker('setDate', dateStart).find('.ui-datepicker-current-day').trigger('click');
			rp.find('.range-end').datepicker('setDate', dateEnd).find('.ui-datepicker-current-day').trigger('click');
		}
		
		return false;
	}	
	

	//picker divs
	var rpPickers = jQuery('<div class="ranges ui-widget-header ui-corner-all ui-helper-clearfix"><div class="range-start"><span class="title-start">Start Date</span></div><div class="range-end"><span class="title-end">End Date</span></div></div>').appendTo(rp);
	rpPickers.find('.range-start, .range-end')
		.datepicker(options.datepickerOptions);
	
	
	rpPickers.find('.range-start').datepicker('setDate', inputDateA);
	rpPickers.find('.range-end').datepicker('setDate', inputDateB);
	
	rpPickers.find('.range-start, .range-end')	
		.bind('constrainOtherPicker', function(){
			if(options.constrainDates){
				//constrain dates
				if($(this).is('.range-start')){
					rp.find('.range-end').datepicker( "option", "minDate", $(this).datepicker('getDate'));
				}
				else{
					rp.find('.range-start').datepicker( "option", "maxDate", $(this).datepicker('getDate'));
				}			
			}
		})
		.trigger('constrainOtherPicker');
	
	var doneBtn = jQuery('<button class="btnDone ui-state-default ui-corner-all">'+ options.doneButtonText +'</button>')
	.click(function(){
		rp.find('.ui-datepicker-current-day').trigger('click');
		hideRP();
	})
	.hover(
			function(){
				jQuery(this).addClass('ui-state-hover');
			},
			function(){
				jQuery(this).removeClass('ui-state-hover');
			}
	)
	.appendTo(rpPickers);
	
	
	
	
	//inputs toggle rangepicker visibility
	jQuery(this).click(function(){
		toggleRP();
		return false;
	});
	//hide em all
	rpPickers.hide().find('.range-start, .range-end, .btnDone').hide();
	
	rp.data('state', 'closed');
	
	//Fixed for jQuery UI 1.8.7 - Calendars are hidden otherwise!
	rpPickers.find('.ui-datepicker').css("display","block");
	
	//inject rp
	jQuery(options.appendTo).append(rp);
	
	//wrap and position
	rp.wrap('<div class="ui-daterangepickercontain"></div>');

	//add arrows (only available on one input)
	if(options.arrows && rangeInput.size()==1){
		var prevLink = jQuery('<a href="#" class="ui-daterangepicker-prev ui-corner-all" title="'+ options.prevLinkText +'"><span class="ui-icon ui-icon-circle-triangle-w">'+ options.prevLinkText +'</span></a>');
		var nextLink = jQuery('<a href="#" class="ui-daterangepicker-next ui-corner-all" title="'+ options.nextLinkText +'"><span class="ui-icon ui-icon-circle-triangle-e">'+ options.nextLinkText +'</span></a>');
	
		jQuery(this)
		.addClass('ui-rangepicker-input ui-widget-content')
		.wrap('<div class="ui-daterangepicker-arrows ui-widget ui-widget-header ui-helper-clearfix ui-corner-all"></div>')
		.before( prevLink )
		.before( nextLink )
		.parent().find('a').click(function(){
			var dateA = rpPickers.find('.range-start').datepicker('getDate');
			var dateB = rpPickers.find('.range-end').datepicker('getDate');
			var diff = Math.abs( new TimeSpan(dateA - dateB).getTotalMilliseconds() ) + 86400000; //difference plus one day
			if(jQuery(this).is('.ui-daterangepicker-prev')){ diff = -diff; }
			
			rpPickers.find('.range-start, .range-end ').each(function(){
					var thisDate = jQuery(this).datepicker( "getDate");
					if(thisDate == null){return false;}
					jQuery(this).datepicker( "setDate", thisDate.add({milliseconds: diff}) ).find('.ui-datepicker-current-day').trigger('click');
			});
			return false;
		})
		.hover(
			function(){
				jQuery(this).addClass('ui-state-hover');
			},
			function(){
				jQuery(this).removeClass('ui-state-hover');
			});
		
		var riContain = rangeInput.parent();	
	}
	
	
	jQuery(document).click(function(){
		if (rp.is(':visible')) {
			hideRP();
		}
	}); 

	rp.click(function(){return false;}).hide();
	return this;
}



;
jQuery.fn.daterangepicker=function(s){var c=jQuery(this);var d=jQuery.extend({presetRanges:[{text:"Today",dateStart:"today",dateEnd:"today"},{text:"Last 7 days",dateStart:"today-7days",dateEnd:"today"},{text:"Month to date",dateStart:function(){return Date.parse("today").moveToFirstDayOfMonth()},dateEnd:"today"},{text:"Year to date",dateStart:function(){var w=Date.parse("today");w.setMonth(0);w.setDate(1);return w},dateEnd:"today"},{text:"The previous Month",dateStart:function(){return Date.parse("1 month ago").moveToFirstDayOfMonth()},dateEnd:function(){return Date.parse("1 month ago").moveToLastDayOfMonth()}}],presets:{specificDate:"Specific Date",allDatesBefore:"All Dates Before",allDatesAfter:"All Dates After",dateRange:"Date Range"},rangeStartTitle:"Start date",rangeEndTitle:"End date",nextLinkText:"Next",prevLinkText:"Prev",doneButtonText:"Done",earliestDate:Date.parse("-15years"),latestDate:Date.parse("+15years"),constrainDates:false,rangeSplitter:"-",dateFormat:"m/d/yy",closeOnSelect:true,arrows:false,appendTo:"body",onClose:function(){},onOpen:function(){},onChange:function(){},datepickerOptions:null},s);var f={onSelect:function(z,y){if(i.find(".ui-daterangepicker-specificDate").is(".ui-state-active")){i.find(".range-end").datepicker("setDate",i.find(".range-start").datepicker("getDate"))}$(this).trigger("constrainOtherPicker");var x=a(i.find(".range-start").datepicker("getDate"));var w=a(i.find(".range-end").datepicker("getDate"));if(c.length==2){c.eq(0).val(x);c.eq(1).val(w)}else{c.val((x!=w)?x+" "+d.rangeSplitter+" "+w:x)}if(d.closeOnSelect){if(!i.find("li.ui-state-active").is(".ui-daterangepicker-dateRange")&&!i.is(":animated")){j()}}d.onChange()},defaultDate:+0};c.bind("change",d.onChange);d.datepickerOptions=(s)?jQuery.extend(f,s.datepickerOptions):f;var l,k=Date.parse("today");var n,h;if(c.size()==2){n=Date.parse(c.eq(0).val());h=Date.parse(c.eq(1).val());if(n==null){n=h}if(h==null){h=n}}else{n=Date.parse(c.val().split(d.rangeSplitter)[0]);h=Date.parse(c.val().split(d.rangeSplitter)[1]);if(h==null){h=n}}if(n!=null){l=n}if(h!=null){k=h}var i=jQuery('<div class="ui-daterangepicker ui-widget ui-helper-clearfix ui-widget-content ui-corner-all"></div>');var u=(function(){var y=jQuery('<ul class="ui-widget-content"></ul>').appendTo(i);jQuery.each(d.presetRanges,function(){jQuery('<li class="ui-daterangepicker-'+this.text.replace(/ /g,"")+' ui-corner-all"><a href="#">'+this.text+"</a></li>").data("dateStart",this.dateStart).data("dateEnd",this.dateEnd).appendTo(y)});var w=0;jQuery.each(d.presets,function(x,z){jQuery('<li class="ui-daterangepicker-'+x+" preset_"+w+' ui-helper-clearfix ui-corner-all"><span class="ui-icon ui-icon-triangle-1-e"></span><a href="#">'+z+"</a></li>").appendTo(y);w++});y.find("li").hover(function(){jQuery(this).addClass("ui-state-hover")},function(){jQuery(this).removeClass("ui-state-hover")}).click(function(){i.find(".ui-state-active").removeClass("ui-state-active");jQuery(this).addClass("ui-state-active");p(jQuery(this),i,m,e);return false});return y})();function a(y){if(!y.getDate()){return""}var x=y.getDate();var A=y.getMonth();var z=y.getFullYear();A++;var w=d.dateFormat;return jQuery.datepicker.formatDate(w,y)}jQuery.fn.restoreDateFromData=function(){if(jQuery(this).data("saveDate")){jQuery(this).datepicker("setDate",jQuery(this).data("saveDate")).removeData("saveDate")}return this};jQuery.fn.saveDateToData=function(){if(!jQuery(this).data("saveDate")){jQuery(this).data("saveDate",jQuery(this).datepicker("getDate"))}return this};function t(){if(i.data("state")=="closed"){v();i.fadeIn(300).data("state","open");d.onOpen()}}function j(){if(i.data("state")=="open"){i.fadeOut(300).data("state","closed");d.onClose()}}function b(){if(i.data("state")=="open"){j()}else{t()}}function v(){var w=o||c;var A=w.offset(),y="left",z=A.left,x=jQuery(window).width()-z-w.outerWidth();if(z>x){y="right",z=x}i.parent().css(y,z).css("top",A.top+w.outerHeight())}function p(z,y,A,w){if(z.is(".ui-daterangepicker-specificDate")){w.hide();A.show();y.find(".title-start").text(d.presets.specificDate);y.find(".range-start").restoreDateFromData().css("opacity",1).show(400);y.find(".range-end").restoreDateFromData().css("opacity",0).hide(400);setTimeout(function(){w.fadeIn()},400)}else{if(z.is(".ui-daterangepicker-allDatesBefore")){w.hide();A.show();y.find(".title-end").text(d.presets.allDatesBefore);y.find(".range-start").saveDateToData().datepicker("setDate",d.earliestDate).css("opacity",0).hide(400);y.find(".range-end").restoreDateFromData().css("opacity",1).show(400);setTimeout(function(){w.fadeIn()},400)}else{if(z.is(".ui-daterangepicker-allDatesAfter")){w.hide();A.show();y.find(".title-start").text(d.presets.allDatesAfter);y.find(".range-start").restoreDateFromData().css("opacity",1).show(400);y.find(".range-end").saveDateToData().datepicker("setDate",d.latestDate).css("opacity",0).hide(400);setTimeout(function(){w.fadeIn()},400)}else{if(z.is(".ui-daterangepicker-dateRange")){w.hide();A.show();y.find(".title-start").text(d.rangeStartTitle);y.find(".title-end").text(d.rangeEndTitle);y.find(".range-start").restoreDateFromData().css("opacity",1).show(400);y.find(".range-end").restoreDateFromData().css("opacity",1).show(400);setTimeout(function(){w.fadeIn()},400)}else{w.hide();y.find(".range-start, .range-end").css("opacity",0).hide(400,function(){A.hide()});var B=(typeof z.data("dateStart")=="string")?Date.parse(z.data("dateStart")):z.data("dateStart")();var x=(typeof z.data("dateEnd")=="string")?Date.parse(z.data("dateEnd")):z.data("dateEnd")();y.find(".range-start").datepicker("setDate",B).find(".ui-datepicker-current-day").trigger("click");y.find(".range-end").datepicker("setDate",x).find(".ui-datepicker-current-day").trigger("click")}}}}return false}var m=jQuery('<div class="ranges ui-widget-header ui-corner-all ui-helper-clearfix"><div class="range-start"><span class="title-start">Start Date</span></div><div class="range-end"><span class="title-end">End Date</span></div></div>').appendTo(i);m.find(".range-start, .range-end").datepicker(d.datepickerOptions);m.find(".range-start").datepicker("setDate",l);m.find(".range-end").datepicker("setDate",k);m.find(".range-start, .range-end").bind("constrainOtherPicker",function(){if(d.constrainDates){if($(this).is(".range-start")){i.find(".range-end").datepicker("option","minDate",$(this).datepicker("getDate"))}else{i.find(".range-start").datepicker("option","maxDate",$(this).datepicker("getDate"))}}}).trigger("constrainOtherPicker");var e=jQuery('<button class="btnDone ui-state-default ui-corner-all">'+d.doneButtonText+"</button>").click(function(){i.find(".ui-datepicker-current-day").trigger("click");j()}).hover(function(){jQuery(this).addClass("ui-state-hover")},function(){jQuery(this).removeClass("ui-state-hover")}).appendTo(m);jQuery(this).click(function(){b();return false});m.hide().find(".range-start, .range-end, .btnDone").hide();i.data("state","closed");m.find(".ui-datepicker").css("display","block");jQuery(d.appendTo).append(i);i.wrap('<div class="ui-daterangepickercontain"></div>');if(d.arrows&&c.size()==1){var g=jQuery('<a href="#" class="ui-daterangepicker-prev ui-corner-all" title="'+d.prevLinkText+'"><span class="ui-icon ui-icon-circle-triangle-w">'+d.prevLinkText+"</span></a>");var q=jQuery('<a href="#" class="ui-daterangepicker-next ui-corner-all" title="'+d.nextLinkText+'"><span class="ui-icon ui-icon-circle-triangle-e">'+d.nextLinkText+"</span></a>");jQuery(this).addClass("ui-rangepicker-input ui-widget-content").wrap('<div class="ui-daterangepicker-arrows ui-widget ui-widget-header ui-helper-clearfix ui-corner-all"></div>').before(g).before(q).parent().find("a").click(function(){var x=m.find(".range-start").datepicker("getDate");var w=m.find(".range-end").datepicker("getDate");var y=Math.abs(new TimeSpan(x-w).getTotalMilliseconds())+86400000;if(jQuery(this).is(".ui-daterangepicker-prev")){y=-y}m.find(".range-start, .range-end ").each(function(){var z=jQuery(this).datepicker("getDate");if(z==null){return false}jQuery(this).datepicker("setDate",z.add({milliseconds:y})).find(".ui-datepicker-current-day").trigger("click")});return false}).hover(function(){jQuery(this).addClass("ui-state-hover")},function(){jQuery(this).removeClass("ui-state-hover")});var o=c.parent()}jQuery(document).click(function(){if(i.is(":visible")){j()}});i.click(function(){return false}).hide();return this};Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};Date.getMonthNumberFromName=function(b){var e=Date.CultureInfo.monthNames,a=Date.CultureInfo.abbreviatedMonthNames,d=b.toLowerCase();for(var c=0;c<e.length;c++){if(e[c].toLowerCase()==d||a[c].toLowerCase()==d){return c}}return -1};Date.getDayNumberFromName=function(b){var f=Date.CultureInfo.dayNames,a=Date.CultureInfo.abbreviatedDayNames,e=Date.CultureInfo.shortestDayNames,d=b.toLowerCase();for(var c=0;c<f.length;c++){if(f[c].toLowerCase()==d||a[c].toLowerCase()==d){return c}}return -1};Date.isLeapYear=function(a){return(((a%4===0)&&(a%100!==0))||(a%400===0))};Date.getDaysInMonth=function(a,b){return[31,(Date.isLeapYear(a)?29:28),31,30,31,30,31,31,30,31,30,31][b]};Date.getTimezoneOffset=function(a,b){return(b||false)?Date.CultureInfo.abbreviatedTimeZoneDST[a.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[a.toUpperCase()]};Date.getTimezoneAbbreviation=function(b,d){var c=(d||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,a;for(a in c){if(c[a]===b){return a}}return null};Date.prototype.clone=function(){return new Date(this.getTime())};Date.prototype.compareTo=function(a){if(isNaN(this)){throw new Error(this)}if(a instanceof Date&&!isNaN(a)){return(this>a)?1:(this<a)?-1:0}else{throw new TypeError(a)}};Date.prototype.equals=function(a){return(this.compareTo(a)===0)};Date.prototype.between=function(c,a){var b=this.getTime();return b>=c.getTime()&&b<=a.getTime()};Date.prototype.addMilliseconds=function(a){this.setMilliseconds(this.getMilliseconds()+a);return this};Date.prototype.addSeconds=function(a){return this.addMilliseconds(a*1000)};Date.prototype.addMinutes=function(a){return this.addMilliseconds(a*60000)};Date.prototype.addHours=function(a){return this.addMilliseconds(a*3600000)};Date.prototype.addDays=function(a){return this.addMilliseconds(a*86400000)};Date.prototype.addWeeks=function(a){return this.addMilliseconds(a*604800000)};Date.prototype.addMonths=function(a){var b=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+a);this.setDate(Math.min(b,this.getDaysInMonth()));return this};Date.prototype.addYears=function(a){return this.addMonths(a*12)};Date.prototype.add=function(b){if(typeof b=="number"){this._orient=b;return this}var a=b;if(a.millisecond||a.milliseconds){this.addMilliseconds(a.millisecond||a.milliseconds)}if(a.second||a.seconds){this.addSeconds(a.second||a.seconds)}if(a.minute||a.minutes){this.addMinutes(a.minute||a.minutes)}if(a.hour||a.hours){this.addHours(a.hour||a.hours)}if(a.month||a.months){this.addMonths(a.month||a.months)}if(a.year||a.years){this.addYears(a.year||a.years)}if(a.day||a.days){this.addDays(a.day||a.days)}return this};Date._validate=function(d,c,a,b){if(typeof d!="number"){throw new TypeError(d+" is not a Number.")}else{if(d<c||d>a){throw new RangeError(d+" is not a valid value for "+b+".")}}return true};Date.validateMillisecond=function(a){return Date._validate(a,0,999,"milliseconds")};Date.validateSecond=function(a){return Date._validate(a,0,59,"seconds")};Date.validateMinute=function(a){return Date._validate(a,0,59,"minutes")};Date.validateHour=function(a){return Date._validate(a,0,23,"hours")};Date.validateDay=function(c,a,b){return Date._validate(c,1,Date.getDaysInMonth(a,b),"days")};Date.validateMonth=function(a){return Date._validate(a,0,11,"months")};Date.validateYear=function(a){return Date._validate(a,1,9999,"seconds")};Date.prototype.set=function(b){var a=b;if(!a.millisecond&&a.millisecond!==0){a.millisecond=-1}if(!a.second&&a.second!==0){a.second=-1}if(!a.minute&&a.minute!==0){a.minute=-1}if(!a.hour&&a.hour!==0){a.hour=-1}if(!a.day&&a.day!==0){a.day=-1}if(!a.month&&a.month!==0){a.month=-1}if(!a.year&&a.year!==0){a.year=-1}if(a.millisecond!=-1&&Date.validateMillisecond(a.millisecond)){this.addMilliseconds(a.millisecond-this.getMilliseconds())}if(a.second!=-1&&Date.validateSecond(a.second)){this.addSeconds(a.second-this.getSeconds())}if(a.minute!=-1&&Date.validateMinute(a.minute)){this.addMinutes(a.minute-this.getMinutes())}if(a.hour!=-1&&Date.validateHour(a.hour)){this.addHours(a.hour-this.getHours())}if(a.month!==-1&&Date.validateMonth(a.month)){this.addMonths(a.month-this.getMonth())}if(a.year!=-1&&Date.validateYear(a.year)){this.addYears(a.year-this.getFullYear())}if(a.day!=-1&&Date.validateDay(a.day,this.getFullYear(),this.getMonth())){this.addDays(a.day-this.getDate())}if(a.timezone){this.setTimezone(a.timezone)}if(a.timezoneOffset){this.setTimezoneOffset(a.timezoneOffset)}return this};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return(((a%4===0)&&(a%100!==0))||(a%400===0))};Date.prototype.isWeekday=function(){return !(this.is().sat()||this.is().sun())};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth())};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1})};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()})};Date.prototype.moveToDayOfWeek=function(a,b){var c=(a-this.getDay()+7*(b||+1))%7;return this.addDays((c===0)?c+=7*(b||+1):c)};Date.prototype.moveToMonth=function(c,a){var b=(c-this.getMonth()+12*(a||+1))%12;return this.addMonths((b===0)?b+=12*(a||+1):b)};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000)};Date.prototype.getWeekOfYear=function(a){var h=this.getFullYear(),c=this.getMonth(),f=this.getDate();var j=a||Date.CultureInfo.firstDayOfWeek;var e=7+1-new Date(h,0,1).getDay();if(e==8){e=1}var b=((Date.UTC(h,c,f,0,0,0)-Date.UTC(h,0,1,0,0,0))/86400000)+1;var i=Math.floor((b-e+7)/7);if(i===j){h--;var g=7+1-new Date(h,0,1).getDay();if(g==2||g==8){i=53}else{i=52}}return i};Date.prototype.isDST=function(){return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D"};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST())};Date.prototype.setTimezoneOffset=function(b){var a=this.getTimezoneOffset(),c=Number(b)*-6/10;this.addMinutes(c-a);return this};Date.prototype.setTimezone=function(a){return this.setTimezoneOffset(Date.getTimezoneOffset(a))};Date.prototype.getUTCOffset=function(){var b=this.getTimezoneOffset()*-10/6,a;if(b<0){a=(b-10000).toString();return a[0]+a.substr(2)}else{a=(b+10000).toString();return"+"+a.substr(1)}};Date.prototype.getDayName=function(a){return a?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()]};Date.prototype.getMonthName=function(a){return a?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()]};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(c){var a=this;var b=function b(d){return(d.toString().length==1)?"0"+d:d};return c?c.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(d){switch(d){case"hh":return b(a.getHours()<13?a.getHours():(a.getHours()-12));case"h":return a.getHours()<13?a.getHours():(a.getHours()-12);case"HH":return b(a.getHours());case"H":return a.getHours();case"mm":return b(a.getMinutes());case"m":return a.getMinutes();case"ss":return b(a.getSeconds());case"s":return a.getSeconds();case"yyyy":return a.getFullYear();case"yy":return a.getFullYear().toString().substring(2,4);case"dddd":return a.getDayName();case"ddd":return a.getDayName(true);case"dd":return b(a.getDate());case"d":return a.getDate().toString();case"MMMM":return a.getMonthName();case"MMM":return a.getMonthName(true);case"MM":return b((a.getMonth()+1));case"M":return a.getMonth()+1;case"t":return a.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return a.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return""}}):this._toString()};Date.now=function(){return new Date()};Date.today=function(){return Date.now().clearTime()};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var a={};a[this._dateElement]=this;return Date.now().add(a)};Number.prototype.ago=function(){var a={};a[this._dateElement]=this*-1;return Date.now().add(a)};(function(){var g=Date.prototype,a=Number.prototype;var p=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),o=("january february march april may june july august september october november december").split(/\s/),n=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),m;var l=function(i){return function(){if(this._is){this._is=false;return this.getDay()==i}return this.moveToDayOfWeek(i,this._orient)}};for(var f=0;f<p.length;f++){g[p[f]]=g[p[f].substring(0,3)]=l(f)}var h=function(i){return function(){if(this._is){this._is=false;return this.getMonth()===i}return this.moveToMonth(i,this._orient)}};for(var d=0;d<o.length;d++){g[o[d]]=g[o[d].substring(0,3)]=h(d)}var e=function(i){return function(){if(i.substring(i.length-1)!="s"){i+="s"}return this["add"+i](this._orient)}};var b=function(i){return function(){this._dateElement=i;return this}};for(var c=0;c<n.length;c++){m=n[c].toLowerCase();g[m]=g[m+"s"]=e(n[c]);a[m]=a[m+"s"]=b(m)}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ")};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th"}};(function(){Date.Parsing={Exception:function(i){this.message="Parse error at '"+i.substring(0,10)+" ...'"}};var a=Date.Parsing;var c=a.Operators={rtoken:function(i){return function(j){var k=j.match(i);if(k){return([k[0],j.substring(k[0].length)])}else{throw new a.Exception(j)}}},token:function(i){return function(j){return c.rtoken(new RegExp("^s*"+j+"s*"))(j)}},stoken:function(i){return c.rtoken(new RegExp("^"+i))},until:function(i){return function(j){var k=[],m=null;while(j.length){try{m=i.call(this,j)}catch(l){k.push(m[0]);j=m[1];continue}break}return[k,j]}},many:function(i){return function(j){var m=[],k=null;while(j.length){try{k=i.call(this,j)}catch(l){return[m,j]}m.push(k[0]);j=k[1]}return[m,j]}},optional:function(i){return function(j){var k=null;try{k=i.call(this,j)}catch(l){return[null,j]}return[k[0],k[1]]}},not:function(i){return function(j){try{i.call(this,j)}catch(k){return[null,j]}throw new a.Exception(j)}},ignore:function(i){return i?function(j){var k=null;k=i.call(this,j);return[null,k[1]]}:null},product:function(){var k=arguments[0],l=Array.prototype.slice.call(arguments,1),m=[];for(var j=0;j<k.length;j++){m.push(c.each(k[j],l))}return m},cache:function(k){var i={},j=null;return function(l){try{j=i[l]=(i[l]||k.call(this,l))}catch(m){j=i[l]=m}if(j instanceof a.Exception){throw j}else{return j}}},any:function(){var i=arguments;return function(k){var l=null;for(var j=0;j<i.length;j++){if(i[j]==null){continue}try{l=(i[j].call(this,k))}catch(m){l=null}if(l){return l}}throw new a.Exception(k)}},each:function(){var i=arguments;return function(k){var n=[],l=null;for(var j=0;j<i.length;j++){if(i[j]==null){continue}try{l=(i[j].call(this,k))}catch(m){throw new a.Exception(k)}n.push(l[0]);k=l[1]}return[n,k]}},all:function(){var j=arguments,i=i;return i.each(i.optional(j))},sequence:function(i,j,k){j=j||c.rtoken(/^\s*/);k=k||null;if(i.length==1){return i[0]}return function(o){var p=null,t=null;var v=[];for(var n=0;n<i.length;n++){try{p=i[n].call(this,o)}catch(u){break}v.push(p[0]);try{t=j.call(this,p[1])}catch(m){t=null;break}o=t[1]}if(!p){throw new a.Exception(o)}if(t){throw new a.Exception(t[1])}if(k){try{p=k.call(this,p[1])}catch(l){throw new a.Exception(p[1])}}return[v,(p?p[1]:o)]}},between:function(j,k,i){i=i||j;var l=c.each(c.ignore(j),k,c.ignore(i));return function(m){var n=l.call(this,m);return[[n[0][0],r[0][2]],n[1]]}},list:function(i,j,k){j=j||c.rtoken(/^\s*/);k=k||null;return(i instanceof Array?c.each(c.product(i.slice(0,-1),c.ignore(j)),i.slice(-1),c.ignore(k)):c.each(c.many(c.each(i,c.ignore(j))),px,c.ignore(k)))},set:function(i,j,k){j=j||c.rtoken(/^\s*/);k=k||null;return function(B){var l=null,n=null,m=null,o=null,t=[[],B],A=false;for(var v=0;v<i.length;v++){m=null;n=null;l=null;A=(i.length==1);try{l=i[v].call(this,B)}catch(y){continue}o=[[l[0]],l[1]];if(l[1].length>0&&!A){try{m=j.call(this,l[1])}catch(z){A=true}}else{A=true}if(!A&&m[1].length===0){A=true}if(!A){var w=[];for(var u=0;u<i.length;u++){if(v!=u){w.push(i[u])}}n=c.set(w,j).call(this,m[1]);if(n[0].length>0){o[0]=o[0].concat(n[0]);o[1]=n[1]}}if(o[1].length<t[1].length){t=o}if(t[1].length===0){break}}if(t[0].length===0){return t}if(k){try{m=k.call(this,t[1])}catch(x){throw new a.Exception(t[1])}t[1]=m[1]}return t}},forward:function(i,j){return function(k){return i[j].call(this,k)}},replace:function(j,i){return function(k){var l=j.call(this,k);return[i,l[1]]}},process:function(j,i){return function(k){var l=j.call(this,k);return[i.call(this,l[0]),l[1]]}},min:function(i,j){return function(k){var l=j.call(this,k);if(l[0].length<i){throw new a.Exception(k)}return l}}};var h=function(i){return function(){var j=null,m=[];if(arguments.length>1){j=Array.prototype.slice.call(arguments)}else{if(arguments[0] instanceof Array){j=arguments[0]}}if(j){for(var l=0,k=j.shift();l<k.length;l++){j.unshift(k[l]);m.push(i.apply(null,j));j.shift();return m}}else{return i.apply(null,arguments)}}};var g="optional not ignore cache".split(/\s/);for(var d=0;d<g.length;d++){c[g[d]]=h(c[g[d]])}var f=function(i){return function(){if(arguments[0] instanceof Array){return i.apply(null,arguments[0])}else{return i.apply(null,arguments)}}};var e="each any all".split(/\s/);for(var b=0;b<e.length;b++){c[e[b]]=f(c[e[b]])}}());(function(){var f=function(j){var k=[];for(var g=0;g<j.length;g++){if(j[g] instanceof Array){k=k.concat(f(j[g]))}else{if(j[g]){k.push(j[g])}}}return k};Date.Grammar={};Date.Translator={hour:function(g){return function(){this.hour=Number(g)}},minute:function(g){return function(){this.minute=Number(g)}},second:function(g){return function(){this.second=Number(g)}},meridian:function(g){return function(){this.meridian=g.slice(0,1).toLowerCase()}},timezone:function(g){return function(){var j=g.replace(/[^\d\+\-]/g,"");if(j.length){this.timezoneOffset=Number(j)}else{this.timezone=g.toLowerCase()}}},day:function(g){var j=g[0];return function(){this.day=Number(j.match(/\d+/)[0])}},month:function(g){return function(){this.month=((g.length==3)?Date.getMonthNumberFromName(g):(Number(g)-1))}},year:function(g){return function(){var j=Number(g);this.year=((g.length>2)?j:(j+(((j+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)))}},rday:function(g){return function(){switch(g){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break}}},finishExact:function(g){g=(g instanceof Array)?g:[g];var j=new Date();this.year=j.getFullYear();this.month=j.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var k=0;k<g.length;k++){if(g[k]){g[k].call(this)}}this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.")}var l=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){l.set({timezone:this.timezone})}else{if(this.timezoneOffset){l.set({timezoneOffset:this.timezoneOffset})}}return l},finish:function(g){g=(g instanceof Array)?f(g):[g];if(g.length===0){return null}for(var m=0;m<g.length;m++){if(typeof g[m]=="function"){g[m].call(this)}}if(this.now){return new Date()}var j=Date.today();var p=null;var n=!!(this.days!=null||this.orient||this.operator);if(n){var o,l,k;k=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";o=(Date.getDayNumberFromName(this.weekday)-j.getDay());l=7;this.days=o?((o+(k*l))%l):(k*l)}if(this.month){this.unit="month";o=(this.month-j.getMonth());l=12;this.months=o?((o+(k*l))%l):(k*l);this.month=null}if(!this.unit){this.unit="day"}if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1}if(this.unit=="week"){this.unit="day";this.value=this.value*7}this[this.unit+"s"]=this.value*k}return j.add(this)}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour}if(this.weekday&&!this.day){this.day=(j.addDays((Date.getDayNumberFromName(this.weekday)-j.getDay()))).getDate()}if(this.month&&!this.day){this.day=1}return j.set(this)}}};var b=Date.Parsing.Operators,e=Date.Grammar,d=Date.Translator,i;e.datePartDelimiter=b.rtoken(/^([\s\-\.\,\/\x27]+)/);e.timePartDelimiter=b.stoken(":");e.whiteSpace=b.rtoken(/^\s*/);e.generalDelimiter=b.rtoken(/^(([\s\,]|at|on)+)/);var a={};e.ctoken=function(m){var l=a[m];if(!l){var n=Date.CultureInfo.regexPatterns;var k=m.split(/\s+/),j=[];for(var g=0;g<k.length;g++){j.push(b.replace(b.rtoken(n[k[g]]),k[g]))}l=a[m]=b.any.apply(null,j)}return l};e.ctoken2=function(g){return b.rtoken(Date.CultureInfo.regexPatterns[g])};e.h=b.cache(b.process(b.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),d.hour));e.hh=b.cache(b.process(b.rtoken(/^(0[0-9]|1[0-2])/),d.hour));e.H=b.cache(b.process(b.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),d.hour));e.HH=b.cache(b.process(b.rtoken(/^([0-1][0-9]|2[0-3])/),d.hour));e.m=b.cache(b.process(b.rtoken(/^([0-5][0-9]|[0-9])/),d.minute));e.mm=b.cache(b.process(b.rtoken(/^[0-5][0-9]/),d.minute));e.s=b.cache(b.process(b.rtoken(/^([0-5][0-9]|[0-9])/),d.second));e.ss=b.cache(b.process(b.rtoken(/^[0-5][0-9]/),d.second));e.hms=b.cache(b.sequence([e.H,e.mm,e.ss],e.timePartDelimiter));e.t=b.cache(b.process(e.ctoken2("shortMeridian"),d.meridian));e.tt=b.cache(b.process(e.ctoken2("longMeridian"),d.meridian));e.z=b.cache(b.process(b.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),d.timezone));e.zz=b.cache(b.process(b.rtoken(/^(\+|\-)\s*\d\d\d\d/),d.timezone));e.zzz=b.cache(b.process(e.ctoken2("timezone"),d.timezone));e.timeSuffix=b.each(b.ignore(e.whiteSpace),b.set([e.tt,e.zzz]));e.time=b.each(b.optional(b.ignore(b.stoken("T"))),e.hms,e.timeSuffix);e.d=b.cache(b.process(b.each(b.rtoken(/^([0-2]\d|3[0-1]|\d)/),b.optional(e.ctoken2("ordinalSuffix"))),d.day));e.dd=b.cache(b.process(b.each(b.rtoken(/^([0-2]\d|3[0-1])/),b.optional(e.ctoken2("ordinalSuffix"))),d.day));e.ddd=e.dddd=b.cache(b.process(e.ctoken("sun mon tue wed thu fri sat"),function(g){return function(){this.weekday=g}}));e.M=b.cache(b.process(b.rtoken(/^(1[0-2]|0\d|\d)/),d.month));e.MM=b.cache(b.process(b.rtoken(/^(1[0-2]|0\d)/),d.month));e.MMM=e.MMMM=b.cache(b.process(e.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),d.month));e.y=b.cache(b.process(b.rtoken(/^(\d\d?)/),d.year));e.yy=b.cache(b.process(b.rtoken(/^(\d\d)/),d.year));e.yyy=b.cache(b.process(b.rtoken(/^(\d\d?\d?\d?)/),d.year));e.yyyy=b.cache(b.process(b.rtoken(/^(\d\d\d\d)/),d.year));i=function(){return b.each(b.any.apply(null,arguments),b.not(e.ctoken2("timeContext")))};e.day=i(e.d,e.dd);e.month=i(e.M,e.MMM);e.year=i(e.yyyy,e.yy);e.orientation=b.process(e.ctoken("past future"),function(g){return function(){this.orient=g}});e.operator=b.process(e.ctoken("add subtract"),function(g){return function(){this.operator=g}});e.rday=b.process(e.ctoken("yesterday tomorrow today now"),d.rday);e.unit=b.process(e.ctoken("minute hour day week month year"),function(g){return function(){this.unit=g}});e.value=b.process(b.rtoken(/^\d\d?(st|nd|rd|th)?/),function(g){return function(){this.value=g.replace(/\D/g,"")}});e.expression=b.set([e.rday,e.operator,e.value,e.unit,e.orientation,e.ddd,e.MMM]);i=function(){return b.set(arguments,e.datePartDelimiter)};e.mdy=i(e.ddd,e.month,e.day,e.year);e.ymd=i(e.ddd,e.year,e.month,e.day);e.dmy=i(e.ddd,e.day,e.month,e.year);e.date=function(g){return((e[Date.CultureInfo.dateElementOrder]||e.mdy).call(this,g))};e.format=b.process(b.many(b.any(b.process(b.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(g){if(e[g]){return e[g]}else{throw Date.Parsing.Exception(g)}}),b.process(b.rtoken(/^[^dMyhHmstz]+/),function(g){return b.ignore(b.stoken(g))}))),function(g){return b.process(b.each.apply(null,g),d.finishExact)});var h={};var c=function(g){return h[g]=(h[g]||e.format(g)[0])};e.formats=function(j){if(j instanceof Array){var k=[];for(var g=0;g<j.length;g++){k.push(c(j[g]))}return b.any.apply(null,k)}else{return c(j)}};e._formats=e.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);e._start=b.process(b.set([e.date,e.time,e.expression],e.generalDelimiter,e.whiteSpace),d.finish);e.start=function(g){try{var j=e._formats.call({},g);if(j[1].length===0){return j}}catch(k){}return e._start.call({},g)}}());Date._parse=Date.parse;Date.parse=function(a){var b=null;if(!a){return null}try{b=Date.Grammar.start.call({},a)}catch(c){return null}return((b[1].length===0)?b[0]:null)};Date.getParseFunction=function(b){var a=Date.Grammar.formats(b);return function(c){var d=null;try{d=a.call({},c)}catch(f){return null}return((d[1].length===0)?d[0]:null)}};Date.parseExact=function(a,b){return Date.getParseFunction(b)(a)};var TimeSpan=function(m,h,e,j,d){var l="days hours minutes seconds milliseconds".split(/\s+/);var c=function(i){return function(){return this[i]}};var k=function(i){return function(n){this[i]=n;return this}};for(var g=0;g<l.length;g++){var b=l[g],a=b.slice(0,1).toUpperCase()+b.slice(1);TimeSpan.prototype[b]=0;TimeSpan.prototype["get"+a]=c(b);TimeSpan.prototype["set"+a]=k(b)}if(arguments.length==4){this.setDays(m);this.setHours(h);this.setMinutes(e);this.setSeconds(j)}else{if(arguments.length==5){this.setDays(m);this.setHours(h);this.setMinutes(e);this.setSeconds(j);this.setMilliseconds(d)}else{if(arguments.length==1&&typeof m=="number"){var f=(m<0)?-1:+1;this.setMilliseconds(Math.abs(m));this.setDays(Math.floor(this.getMilliseconds()/86400000)*f);this.setMilliseconds(this.getMilliseconds()%86400000);this.setHours(Math.floor(this.getMilliseconds()/3600000)*f);this.setMilliseconds(this.getMilliseconds()%3600000);this.setMinutes(Math.floor(this.getMilliseconds()/60000)*f);this.setMilliseconds(this.getMilliseconds()%60000);this.setSeconds(Math.floor(this.getMilliseconds()/1000)*f);this.setMilliseconds(this.getMilliseconds()%1000);this.setMilliseconds(this.getMilliseconds()*f)}}}this.getTotalMilliseconds=function(){return(this.getDays()*86400000)+(this.getHours()*3600000)+(this.getMinutes()*60000)+(this.getSeconds()*1000)};this.compareTo=function(o){var n=new Date(1970,1,1,this.getHours(),this.getMinutes(),this.getSeconds()),i;if(o===null){i=new Date(1970,1,1,0,0,0)}else{i=new Date(1970,1,1,o.getHours(),o.getMinutes(),o.getSeconds())}return(n<i)?-1:(n>i)?1:0};this.equals=function(i){return(this.compareTo(i)===0)};this.add=function(i){return(i===null)?this:this.addSeconds(i.getTotalMilliseconds()/1000)};this.subtract=function(i){return(i===null)?this:this.addSeconds(-i.getTotalMilliseconds()/1000)};this.addDays=function(i){return new TimeSpan(this.getTotalMilliseconds()+(i*86400000))};this.addHours=function(i){return new TimeSpan(this.getTotalMilliseconds()+(i*3600000))};this.addMinutes=function(i){return new TimeSpan(this.getTotalMilliseconds()+(i*60000))};this.addSeconds=function(i){return new TimeSpan(this.getTotalMilliseconds()+(i*1000))};this.addMilliseconds=function(i){return new TimeSpan(this.getTotalMilliseconds()+i)};this.get12HourHour=function(){return(this.getHours()>12)?this.getHours()-12:(this.getHours()===0)?12:this.getHours()};this.getDesignator=function(){return(this.getHours()<12)?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator};this.toString=function(n){this._toString=function(){if(this.getDays()!==null&&this.getDays()>0){return this.getDays()+"."+this.getHours()+":"+this.p(this.getMinutes())+":"+this.p(this.getSeconds())}else{return this.getHours()+":"+this.p(this.getMinutes())+":"+this.p(this.getSeconds())}};this.p=function(o){return(o.toString().length<2)?"0"+o:o};var i=this;return n?n.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g,function(o){switch(o){case"d":return i.getDays();case"dd":return i.p(i.getDays());case"H":return i.getHours();case"HH":return i.p(i.getHours());case"h":return i.get12HourHour();case"hh":return i.p(i.get12HourHour());case"m":return i.getMinutes();case"mm":return i.p(i.getMinutes());case"s":return i.getSeconds();case"ss":return i.p(i.getSeconds());case"t":return((i.getHours()<12)?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator).substring(0,1);case"tt":return(i.getHours()<12)?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator}}):this._toString()};return this};Date.prototype.getTimeOfDay=function(){return new TimeSpan(0,this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds())};var TimePeriod=function(n,f,e,q,o,k,g){var m="years months days hours minutes seconds milliseconds".split(/\s+/);var j=function(i){return function(){return this[i]}};var b=function(i){return function(v){this[i]=v;return this}};for(var p=0;p<m.length;p++){var d=m[p],c=d.slice(0,1).toUpperCase()+d.slice(1);TimePeriod.prototype[d]=0;TimePeriod.prototype["get"+c]=j(d);TimePeriod.prototype["set"+c]=b(d)}if(arguments.length==7){this.years=n;this.months=f;this.setDays(e);this.setHours(q);this.setMinutes(o);this.setSeconds(k);this.setMilliseconds(g)}else{if(arguments.length==2&&arguments[0] instanceof Date&&arguments[1] instanceof Date){var u=n.clone();var t=f.clone();var s=u.clone();var h=(u>t)?-1:+1;this.years=t.getFullYear()-u.getFullYear();s.addYears(this.years);if(h==+1){if(s>t){if(this.years!==0){this.years--}}}else{if(s<t){if(this.years!==0){this.years++}}}u.addYears(this.years);if(h==+1){while(u<t&&u.clone().addDays(Date.getDaysInMonth(u.getYear(),u.getMonth()))<t){u.addMonths(1);this.months++}}else{while(u>t&&u.clone().addDays(-u.getDaysInMonth())>t){u.addMonths(-1);this.months--}}var l=t-u;if(l!==0){var a=new TimeSpan(l);this.setDays(a.getDays());this.setHours(a.getHours());this.setMinutes(a.getMinutes());this.setSeconds(a.getSeconds());this.setMilliseconds(a.getMilliseconds())}}}return this};
/*
 * EnhanceJS version 1.1 - Test-Driven Progressive Enhancement
 * http://enhancejs.googlecode.com/
 * Copyright (c) 2010 Filament Group, Inc, authors.txt
 * Licensed under MIT (license.txt)
*/
(function(a,b,c){function o(){return!!b.cookie}function p(){J(d.testName,"fail");a.location.reload()}function q(){J(d.testName,"pass");a.location.reload()}function r(){L(d.testName);a.location.reload()}function s(){f=b.createElement("body");i.insertBefore(f,i.firstChild);e=f}function t(){i.removeChild(f);e=b.body}function u(){var a=K(d.testName);if(a){if(a==="pass"){y();d.onPass()}else{d.onFail();x()}d.appendToggleLink&&v(function(){w(a)})}else{var b=!0;s();for(var c in d.tests){b=d.tests[c]();if(!b){d.alertOnFailure&&alert(c+" failed");break}}t();a=b?"pass":"fail";J(d.testName,a);if(b){y();d.onPass()}else{d.onFail();x()}d.appendToggleLink&&v(function(){w(a)})}}function v(b){if(g)b();else{var c=a.onload;a.onload=function(){c&&c();b()}}}function w(a){if(!d.appendToggleLink||!enhance.cookiesSupported)return;if(a){var c=b.createElement("a");c.href="#";c.className=d.testName+"_toggleResult";c.innerHTML=a==="pass"?d.forceFailText:d.forcePassText;c.onclick=a==="pass"?enhance.forceFail:enhance.forcePass;b.getElementsByTagName("body")[0].appendChild(c)}}function x(){i.className=i.className.replace(d.testName,"")}function y(){j=!0;d.loadStyles.length&&D();d.loadScripts.length?F():d.onScriptsLoaded()}function z(b,c){if(K(k)&&K(l)){L(k);L(l)}else{J(k,b);J(l,c)}a.location.reload()}function A(a){m.length==2&&(a==m[0]?a=m[1]:a==m[1]&&(a=m[0]));return a}function B(){var a=d.testName+"-incomplete";i.className.indexOf(a)===-1&&(i.className+=" "+a)}function C(a){if(a.constructor===Array){var b=!0;for(var c in a)b&&(b=!!a[c]);return b}return!!a}function D(){var a=-1,e;while(e=d.loadStyles[++a]){var f=b.createElement("link");f.type="text/css";f.rel="stylesheet";f.onerror=d.onLoadError;if(typeof e=="string"){f.href=e;h.appendChild(f)}else{if(e.media){e.media=A(e.media);d.media&&d.media[e.media]!==c&&(e.media=d.media[e.media])}e.excludemedia&&(e.excludemedia=A(e.excludemedia));var g=!0;e.media&&e.media!=="print"&&e.media!=="projection"&&e.media!=="speech"&&e.media!=="aural"&&e.media!=="braille"&&(g=n(e.media));g&&e.excludemedia&&(g=!n(e.excludemedia));g&&e.iecondition&&(g=E(e.iecondition));if(g&&e.ifsupported!==c){g=C(e.ifsupported);if(!g&&e.fallback!==c){e.href=e.fallback;g=!0}}if(g){for(var i in e)i!=="iecondition"&&i!=="excludemedia"&&i!=="ifsupported"&&i!=="fallback"&&f.setAttribute(i,e[i]);h.appendChild(f)}}}}function F(){d.queueLoading?G():H()}function G(){function b(){if(a.length===0)return!1;var c=a.shift(),e=I(c),f=!1;if(!e)return b();e.onload=e.onreadystatechange=function(){if(!f&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){f=!0;b()===!1&&d.onScriptsLoaded();this.onload=this.onreadystatechange=null}};h.insertBefore(e,h.firstChild)}var a=[].concat(d.loadScripts);b()}function H(){var a=-1,b;while(b=d.loadScripts[++a]){var c=I(b);c&&h.insertBefore(c,h.firstChild)}d.onScriptsLoaded()}function I(a){var e=b.createElement("script");e.type="text/javascript";e.onerror=d.onLoadError;if(typeof a=="string"){e.src=a;return e}if(a.media){a.media=A(a.media);d.media&&d.media[a.media]&&(a.media=d.media[a.media])}a.excludemedia&&(a.excludemedia=A(a.excludemedia));var f=!0;a.media&&(f=n(a.media));f&&a.excludemedia&&(f=!n(a.excludemedia));f&&a.iecondition&&(f=E(a.iecondition));if(f&&a.ifsupported!==c){f=C(a.ifsupported);if(!f&&a.fallback!==c){a.src=a.fallback;f=!0}}if(f){for(var g in a)g!=="iecondition"&&g!=="media"&&g!=="excludemedia"&&g!=="ifsupported"&&g!=="fallback"&&e.setAttribute(g,a[g]);return e}return!1}function J(a,c,d){d=d||90;var e=new Date;e.setTime(e.getTime()+d*24*60*60*1e3);var f="; expires="+e.toGMTString();b.cookie=a+"="+c+f+"; path=/"}function K(a){var c=a+"=",d=b.cookie.split(";");for(var e=0;e<d.length;e++){var f=d[e];while(f.charAt(0)==" ")f=f.substring(1,f.length);if(f.indexOf(c)==0)return f.substring(c.length,f.length)}return null}function L(a){J(a,"",-1)}function M(){if(b.readyState==null&&b.addEventListener){b.addEventListener("DOMContentLoaded",function a(){b.removeEventListener("DOMContentLoaded",a,!1);b.readyState="complete"},!1);b.readyState="loading"}}var d,e,f,g,h,i=b.documentElement,j=!1,k,l,m=[];b.getElementsByTagName?h=b.getElementsByTagName("head")[0]||i:h=i;var n=function(){var a={},d=b.createElement("div");d.setAttribute("id","ejs-qtest");return function(f){if(a[f]===c){s();var g=b.createElement("style");g.type="text/css";h.appendChild(g);var i="@media "+f+" { #ejs-qtest { position: absolute; width: 10px; } }";g.styleSheet?g.styleSheet.cssText=i:g.appendChild(b.createTextNode(i));e.appendChild(d);var j=d.offsetWidth;e.removeChild(d);h.removeChild(g);t();a[f]=j==10}return a[f]}}();a.enhance=function(a){a=a||{};d={};for(var b in enhance.defaultSettings){var e=a[b];d[b]=e!==c?e:enhance.defaultSettings[b]}for(var f in a.addTests)d.tests[f]=a.addTests[f];i.className.indexOf(d.testName)===-1&&(i.className+=" "+d.testName);k=d.testName+"-toggledmediaA";l=d.testName+"-toggledmediaB";m=[K(k),K(l)];setTimeout(function(){j||x()},3e3);u();M();v(function(){g=!0})};enhance.query=n;enhance.defaultTests={getById:function(){return!!b.getElementById},getByTagName:function(){return!!b.getElementsByTagName},createEl:function(){return!!b.createElement},boxmodel:function(){var a=b.createElement("div");a.style.cssText="width: 1px; padding: 1px;";e.appendChild(a);var c=a.offsetWidth;e.removeChild(a);return c===3},position:function(){var a=b.createElement("div");a.style.cssText="position: absolute; left: 10px;";e.appendChild(a);var c=a.offsetLeft;e.removeChild(a);return c===10},floatClear:function(){var a=!1,c=b.createElement("div"),d='style="width: 5px; height: 5px; float: left;"';c.innerHTML="<div "+d+"></div><div "+d+"></div>";e.appendChild(c);var f=c.childNodes,g=f[0].offsetTop,h=f[1],i=h.offsetTop;if(g===i){h.style.clear="left";i=h.offsetTop;g!==i&&(a=!0)}e.removeChild(c);return a},heightOverflow:function(){var a=b.createElement("div");a.innerHTML='<div style="height: 10px;"></div>';a.style.cssText="overflow: hidden; height: 0;";e.appendChild(a);var c=a.offsetHeight;e.removeChild(a);return c===0},ajax:function(){var a=!1,b=-1,c,d=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];while(c=d[++b]){try{a=c()}catch(e){continue}break}return!!a},resize:function(){return a.onresize!=0},print:function(){return!!a.print}};enhance.defaultSettings={testName:"enhanced",loadScripts:[],loadStyles:[],queueLoading:!0,appendToggleLink:!0,forcePassText:"View high-bandwidth version",forceFailText:"View low-bandwidth version",tests:enhance.defaultTests,media:{"-ejs-desktop":enhance.query("screen and (max-device-width: 1024px)")?"not screen and (max-device-width: 1024px)":"screen","-ejs-handheld":"screen and (max-device-width: 1024px)"},addTests:{},alertOnFailure:!1,onPass:function(){},onFail:function(){},onLoadError:B,onScriptsLoaded:function(){}};enhance.cookiesSupported=o();enhance.cookiesSupported&&(enhance.forceFail=p);enhance.cookiesSupported&&(enhance.forcePass=q);enhance.cookiesSupported&&(enhance.reTest=r);enhance.toggleMedia=z;var E=function(){var a={},d;return function(e){return!1}}()})(window,document);
/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group. Updated 2012.
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */

/**
 * All credits go to the Author of this file, some additional customization was
 * done for theme compat. purposes.
 *
 * Additional bugfixes/changes by smurfy
 */

!function ($) {

    "use strict"; // jshint ;_;

    /* FILEINPUT CLASS DEFINITION
     * ====================== */

    var CustomFileInput = function (content, options) {
        var self = this;
        this.$element = $(content);

        this.options = $.extend({
            classes	: (this.$element.attr('class') ? this.$element.attr('class') : ''),
        }, options);

        //create custom control container
        this.$upload = $('<div class="input-' + (('right' === this.options.button_position)?'append':'prepend') + ' customfile">');
        //create custom control feedback
        this.$uploadFeedback = $('<input type="text" readonly="readonly" class="customfile-feedback ' + this.options.classes + '" aria-hidden="true" value="' + this.options.feedback_text + '"/>').appendTo(this.$upload);
        //create custom control button
        this.$uploadButton = $('<span class="add-on customfile-button" aria-hidden="true">' + this.options.button_text + '</span>').css({ float : this.options.button_position });

        this.$element
            .addClass('customfile-input') //add class for CSS
            .on('focus', $.proxy(this.onFocus, this))
            .on('blur', $.proxy(this.onBlur, this))
            .on('disable', $.proxy(this.onDisable, this))
            .on('enable', $.proxy(this.onEnable, this))
            .on('checkChange', $.proxy(this.onCheckChange, this))
            .on('change', $.proxy(this.onChange, this))
            .on('click', $.proxy(this.onClick, this));

        if ('right' === this.options.button_position) {
            this.$uploadButton.insertAfter(this.$uploadFeedback);
        } else {
            this.$uploadButton.insertBefore(this.$uploadFeedback);
        }

        //match disabled state
        if (this.$element.is('[disabled]')) {
            this.$element.trigger('disable');
        } else {
            this.$upload.on('click', function () { self.$element.trigger('click'); });
        }

        //insert original input file in dom, css if hide it outside of screen
        this.$upload.insertAfter(this.$element);
        this.$element.insertAfter(this.$upload);
    };

    CustomFileInput.prototype = {
        constructor: CustomFileInput,

        onClick : function() {
            var self = this;
            this.$element.data('val', this.$element.val());
            setTimeout(function(){
                self.$element.trigger('checkChange');
            } ,100);
        },

        onCheckChange: function() {
            if(this.$element.val() && this.$element.val() != this.$element.data('val')){
                this.$element.trigger('change');
            }
        },

        onEnable: function() {
            this.$element.removeAttr('disabled');
            this.$upload.removeClass('customfile-disabled');
        },

        onDisable: function() {
            this.$element.attr('disabled',true);
            this.$upload.addClass('customfile-disabled');
        },

        onFocus: function() {
            this.$upload.addClass('customfile-focus');
            this.$element.data('val', this.$element.val());
        },

        onBlur: function() {
            this.$upload.removeClass('customfile-focus');
            this.$element.trigger('checkChange');
        },

        onChange : function() {
            //get file name
            var fileName = this.$element.val().split(/\\/).pop();
            if (!fileName) {
                this.$uploadFeedback
                    .val(this.options.feedback_text) //set feedback text to filename
                    .removeClass('customfile-feedback-populated'); //add class to show populated state
                this.$uploadButton.text(this.options.button_text);
            } else {
                this.$uploadFeedback
                    .val(fileName) //set feedback text to filename
                    .addClass('customfile-feedback-populated'); //add class to show populated state
                this.$uploadButton.text(this.options.button_change_text);
            }
        }
    };

    $.fn.customFileInput = function(option){
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('customFileInput')
            var options = $.extend({}, $.fn.customFileInput.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) {
                $this.data('customFileInput', (data = new CustomFileInput(this, options)));
            }
        })
    };

    $.fn.customFileInput.defaults = {
        button_position 	: 'right',
        feedback_text		: 'No file selected...',
        button_text			: 'Browse',
        button_change_text	: 'Change'
    }

}(window.jQuery);

(function() {


}).call(this);
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.3-pre
 */


(function($){

$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });

// old alias
$.fn.bgIframe = $.fn.bgiframe;

function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}

})(jQuery);
/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 *
 * Requires: 1.2.2+
 */

(function(c){var a=["DOMMouseScroll","mousewheel"];c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=a.length;d;){this.addEventListener(a[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=a.length;d;){this.removeEventListener(a[--d],b,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(i){var g=i||window.event,f=[].slice.call(arguments,1),j=0,h=true,e=0,d=0;i=c.event.fix(g);i.type="mousewheel";if(i.wheelDelta){j=i.wheelDelta/120}if(i.detail){j=-i.detail/3}d=j;if(g.axis!==undefined&&g.axis===g.HORIZONTAL_AXIS){d=0;e=-1*j}if(g.wheelDeltaY!==undefined){d=g.wheelDeltaY/120}if(g.wheelDeltaX!==undefined){e=-1*g.wheelDeltaX/120}f.unshift(i,j,e,d);return c.event.handle.apply(this,f)}})(jQuery);
/*
 *
 * Wijmo Library 2.2.0
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * licensing@wijmo.com
 * http://www.wijmo.com/license
 *
 **/
/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function(z,y){var a,x,t,s,w,c,j,r,k,v,p,e,b,q,f,h,m,n,u,l,g,i,o,d;a=function(b){return new a.prototype.init(b)};if(typeof require!=="undefined"&&typeof exports!=="undefined"&&typeof module!=="undefined")module.exports=a;else z.Globalize=a;a.cultures={};a.prototype={constructor:a,init:function(b){this.cultures=a.cultures;this.cultureSelector=b;return this}};a.prototype.init.prototype=a.prototype;a.cultures["default"]={name:"en",englishName:"English",nativeName:"English",isRTL:false,language:"en",numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSizes:[3],"+":"+","-":"-",NaN:"NaN",negativeInfinity:"-Infinity",positiveInfinity:"Infinity",percent:{pattern:["-n %","n %"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"$"}},calendars:{standard:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy'-'MM'-'dd'T'HH':'mm':'ss"}}},messages:{}};a.cultures["default"].calendar=a.cultures["default"].calendars.standard;a.cultures.en=a.cultures["default"];a.cultureSelector="en";x=/^0x[a-f0-9]+$/i;t=/^[+-]?infinity$/i;s=/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;w=/^\s+|\s+$/g;c=function(a,c){if(a.indexOf)return a.indexOf(c);for(var b=0,d=a.length;b<d;b++)if(a[b]===c)return b;return-1};j=function(b,a){return b.substr(b.length-a.length)===a};r=function(i){var g,d,c,b,f,h,a=arguments[0]||{},e=1,j=arguments.length,i=false;if(typeof a==="boolean"){i=a;a=arguments[1]||{};e=2}if(typeof a!=="object"&&!v(a))a={};for(;e<j;e++)if((g=arguments[e])!=null)for(d in g){c=a[d];b=g[d];if(a===b)continue;if(i&&b&&(p(b)||(f=k(b)))){if(f){f=false;h=c&&k(c)?c:[]}else h=c&&p(c)?c:{};a[d]=r(i,h,b)}else if(b!==y)a[d]=b}return a};k=Array.isArray||function(a){return Object.prototype.toString.call(a)==="[object Array]"};v=function(a){return Object.prototype.toString.call(a)==="[object Function]"};p=function(a){return Object.prototype.toString.call(a)==="[object Object]"};e=function(b,a){return b.indexOf(a)===0};b=function(a){return(a+"").replace(w,"")};q=function(a){return isNaN(a)?NaN:a|0};f=function(a,c,d){for(var b=a.length;b<c;b+=1)a=d?"0"+a:a+"0";return a};h=function(e,b){for(var d=0,a=false,c=0,g=e.length;c<g;c++){var f=e.charAt(c);switch(f){case"'":if(a)b.push("'");else d++;a=false;break;case"\\":a&&b.push("\\");a=!a;break;default:b.push(f);a=false}}return d};m=function(e,a){a=a||"F";var b,d=e.patterns,c=a.length;if(c===1){b=d[a];if(!b)throw"Invalid date format string '"+a+"'.";a=b}else if(c===2&&a.charAt(0)==="%")a=a.charAt(1);return a};n=function(b,f,r){var c=r.calendar,s=c.convert;if(!f||!f.length||f==="i"){var a;if(r&&r.name.length)if(s)a=n(b,c.patterns.F,r);else{var z=new Date(b.getTime()),H=g(b,c.eras);z.setFullYear(i(b,c,H));a=z.toLocaleString()}else a=b.toString();return a}var A=c.eras,y=f==="s";f=m(c,f);a=[];var j,G=["0","00","000"],p,w,B=/([^d]|^)(d|dd)([^d]|$)/g,x=0,v=l(),o;function e(d,a){var b,c=d+"";if(a>1&&c.length<a){b=G[a-2]+c;return b.substr(b.length-a,a)}else b=c;return b}function D(){if(p||w)return p;p=B.test(f);w=true;return p}function u(a,b){if(o)return o[b];switch(b){case 0:return a.getFullYear();case 1:return a.getMonth();case 2:return a.getDate()}}if(!y&&s)o=s.fromGregorian(b);for(;;){var E=v.lastIndex,q=v.exec(f),C=f.slice(E,q?q.index:f.length);x+=h(C,a);if(!q)break;if(x%2){a.push(q[0]);continue}var t=q[0],d=t.length;switch(t){case"ddd":case"dddd":var F=d===3?c.days.namesAbbr:c.days.names;a.push(F[b.getDay()]);break;case"d":case"dd":p=true;a.push(e(u(b,2),d));break;case"MMM":case"MMMM":var k=u(b,1);a.push(c.monthsGenitive&&D()?c.monthsGenitive[d===3?"namesAbbr":"names"][k]:c.months[d===3?"namesAbbr":"names"][k]);break;case"M":case"MM":a.push(e(u(b,1)+1,d));break;case"y":case"yy":case"yyyy":k=o?o[0]:i(b,c,g(b,A),y);if(d<4)k=k%100;a.push(e(k,d));break;case"h":case"hh":j=b.getHours()%12;if(j===0)j=12;a.push(e(j,d));break;case"H":case"HH":a.push(e(b.getHours(),d));break;case"m":case"mm":a.push(e(b.getMinutes(),d));break;case"s":case"ss":a.push(e(b.getSeconds(),d));break;case"t":case"tt":k=b.getHours()<12?c.AM?c.AM[0]:" ":c.PM?c.PM[0]:" ";a.push(d===1?k.charAt(0):k);break;case"f":case"ff":case"fff":a.push(e(b.getMilliseconds(),3).substr(0,d));break;case"z":case"zz":j=b.getTimezoneOffset()/60;a.push((j<=0?"+":"-")+e(Math.floor(Math.abs(j)),d));break;case"zzz":j=b.getTimezoneOffset()/60;a.push((j<=0?"+":"-")+e(Math.floor(Math.abs(j)),2)+":"+e(Math.abs(b.getTimezoneOffset()%60),2));break;case"g":case"gg":c.eras&&a.push(c.eras[g(b,A)].name);break;case"/":a.push(c["/"]);break;default:throw"Invalid date format pattern '"+t+"'.";}}return a.join("")};(function(){var a;a=function(j,h,l){var m=l.groupSizes,i=m[0],k=1,p=Math.pow(10,h),n=Math.round(j*p)/p;if(!isFinite(n))n=j;j=n;var b=j+"",a="",e=b.split(/e/i),c=e.length>1?parseInt(e[1],10):0;b=e[0];e=b.split(".");b=e[0];a=e.length>1?e[1]:"";var q;if(c>0){a=f(a,c,false);b+=a.slice(0,c);a=a.substr(c)}else if(c<0){c=-c;b=f(b,c+1);a=b.slice(-c,b.length)+a;b=b.slice(0,-c)}if(h>0)a=l["."]+(a.length>h?a.slice(0,h):f(a,h));else a="";var d=b.length-1,o=l[","],g="";while(d>=0){if(i===0||i>d)return b.slice(0,d+1)+(g.length?o+g+a:a);g=b.slice(d-i+1,d+1)+(g.length?o+g:"");d-=i;if(k<m.length){i=m[k];k++}}return b.slice(0,d+1)+o+g+a};u=function(d,e,j){if(!isFinite(d))return d===Infinity?j.numberFormat.positiveInfinity:d===-Infinity?j.numberFormat.negativeInfinity:j.numberFormat.NaN;if(!e||e==="i")return j.name.length?d.toLocaleString():d.toString();e=e||"D";var i=j.numberFormat,b=Math.abs(d),g=-1,k;if(e.length>1)g=parseInt(e.slice(1),10);var m=e.charAt(0).toUpperCase(),c;switch(m){case"D":k="n";b=q(b);if(g!==-1)b=f(""+b,g,true);if(d<0)b="-"+b;break;case"N":c=i;case"C":c=c||i.currency;case"P":c=c||i.percent;k=d<0?c.pattern[0]:c.pattern[1]||"n";if(g===-1)g=c.decimals;b=a(b*(m==="P"?100:1),g,c);break;default:throw"Bad number format specifier: "+m;}for(var n=/n|\$|-|%/g,h="";;){var o=n.lastIndex,l=n.exec(k);h+=k.slice(o,l?l.index:k.length);if(!l)break;switch(l[0]){case"n":h+=b;break;case"$":h+=i.currency.symbol;break;case"-":if(/[1-9]/.test(b))h+=i["-"];break;case"%":h+=i.percent.symbol}}return h}})();l=function(){return/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g};g=function(e,c){if(!c)return 0;for(var b,d=e.getTime(),a=0,f=c.length;a<f;a++){b=c[a].start;if(b===null||d>=b)return a}return 0};i=function(d,b,e,c){var a=d.getFullYear();if(!c&&b.eras)a-=b.eras[e].offset;return a};(function(){var p,n,k,j,a,f,d;p=function(d,b){if(b<100){var e=new Date,f=g(e),c=i(e,d,f),a=d.twoDigitYearMax;a=typeof a==="string"?(new Date).getFullYear()%100+parseInt(a,10):a;b+=c-c%100;if(b>a)b-=100}return b};n=function(h,b,i){var e,g=h.days,a=h._upperDays;if(!a)h._upperDays=a=[d(g.names),d(g.namesAbbr),d(g.namesShort)];b=f(b);if(i){e=c(a[1],b);if(e===-1)e=c(a[2],b)}else e=c(a[0],b);return e};k=function(a,e,k){var j=a.months,i=a.monthsGenitive||a.months,b=a._upperMonths,g=a._upperMonthsGen;if(!b){a._upperMonths=b=[d(j.names),d(j.namesAbbr)];a._upperMonthsGen=g=[d(i.names),d(i.namesAbbr)]}e=f(e);var h=c(k?b[1]:b[0],e);if(h<0)h=c(k?g[1]:g[0],e);return h};j=function(d,g){var e=d._parseRegExp;if(!e)d._parseRegExp=e={};else{var o=e[g];if(o)return o}var f=m(d,g).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,"\\\\$1"),b=["^"],p=[],i=0,n=0,k=l(),c;while((c=k.exec(f))!==null){var s=f.slice(i,c.index);i=k.lastIndex;n+=h(s,b);if(n%2){b.push(c[0]);continue}var j=c[0],t=j.length,a;switch(j){case"dddd":case"ddd":case"MMMM":case"MMM":case"gg":case"g":a="(\\D+)";break;case"tt":case"t":a="(\\D*)";break;case"yyyy":case"fff":case"ff":case"f":a="(\\d{"+t+"})";break;case"dd":case"d":case"MM":case"M":case"yy":case"y":case"HH":case"H":case"hh":case"h":case"mm":case"m":case"ss":case"s":a="(\\d\\d?)";break;case"zzz":a="([+-]?\\d\\d?:\\d{2})";break;case"zz":case"z":a="([+-]?\\d\\d?)";break;case"/":a="(\\"+d["/"]+")";break;default:throw"Invalid date format pattern '"+j+"'.";}a&&b.push(a);p.push(c[0])}h(f.slice(i),b);b.push("$");var r=b.join("").replace(/\s+/g,"\\s+"),q={regExp:r,groups:p};return e[g]=q};a=function(a,c,b){return a<c||a>b};f=function(a){return a.split("\u00a0").join(" ").toUpperCase()};d=function(c){for(var b=[],a=0,d=c.length;a<d;a++)b[a]=f(c[a]);return b};o=function(A,M,L){A=b(A);var c=L.calendar,H=j(c,M),K=new RegExp(H.regExp).exec(A);if(K===null)return null;for(var J=H.groups,C=null,m=null,i=null,l=null,u=null,h=0,o,D=0,E=0,B=0,q=null,z=false,w=0,N=J.length;w<N;w++){var d=K[w+1];if(d){var I=J[w],r=I.length,g=parseInt(d,10);switch(I){case"dd":case"d":l=g;if(a(l,1,31))return null;break;case"MMM":case"MMMM":i=k(c,d,r===3);if(a(i,0,11))return null;break;case"M":case"MM":i=g-1;if(a(i,0,11))return null;break;case"y":case"yy":case"yyyy":m=r<4?p(c,g):g;if(a(m,0,9999))return null;break;case"h":case"hh":h=g;if(h===12)h=0;if(a(h,0,11))return null;break;case"H":case"HH":h=g;if(a(h,0,23))return null;break;case"m":case"mm":D=g;if(a(D,0,59))return null;break;case"s":case"ss":E=g;if(a(E,0,59))return null;break;case"tt":case"t":z=c.PM&&(d===c.PM[0]||d===c.PM[1]||d===c.PM[2]);if(!z&&(!c.AM||d!==c.AM[0]&&d!==c.AM[1]&&d!==c.AM[2]))return null;break;case"f":case"ff":case"fff":B=g*Math.pow(10,3-r);if(a(B,0,999))return null;break;case"ddd":case"dddd":u=n(c,d,r===3);if(a(u,0,6))return null;break;case"zzz":var y=d.split(/:/);if(y.length!==2)return null;o=parseInt(y[0],10);if(a(o,-12,13))return null;var x=parseInt(y[1],10);if(a(x,0,59))return null;q=o*60+(e(d,"-")?-x:x);break;case"z":case"zz":o=g;if(a(o,-12,13))return null;q=o*60;break;case"g":case"gg":var t=d;if(!t||!c.eras)return null;t=b(t.toLowerCase());for(var v=0,O=c.eras.length;v<O;v++)if(t===c.eras[v].name.toLowerCase()){C=v;break}if(C===null)return null}}}var f=new Date,G,s=c.convert;G=s?s.fromGregorian(f)[0]:f.getFullYear();if(m===null)m=G;else if(c.eras)m+=c.eras[C||0].offset;if(i===null)i=0;if(l===null)l=1;if(s){f=s.toGregorian(m,i,l);if(f===null)return null}else{f.setFullYear(m,i,l);if(f.getDate()!==l)return null;if(u!==null&&f.getDay()!==u)return null}if(z&&h<12)h+=12;f.setHours(h,D,E,B);if(q!==null){var F=f.getMinutes()-(q+f.getTimezoneOffset());f.setHours(f.getHours()+parseInt(F/60,10),F%60)}return f}})();d=function(a,f,g){var b=f["-"],c=f["+"],d;switch(g){case"n -":b=" "+b;c=" "+c;case"n-":if(j(a,b))d=["-",a.substr(0,a.length-b.length)];else if(j(a,c))d=["+",a.substr(0,a.length-c.length)];break;case"- n":b+=" ";c+=" ";case"-n":if(e(a,b))d=["-",a.substr(b.length)];else if(e(a,c))d=["+",a.substr(c.length)];break;case"(n)":if(e(a,"(")&&j(a,")"))d=["-",a.substr(1,a.length-2)]}return d||["",a]};a.prototype.findClosestCulture=function(b){return a.findClosestCulture.call(this,b)};a.prototype.format=function(d,c,b){return a.format.call(this,d,c,b)};a.prototype.localize=function(c,b){return a.localize.call(this,c,b)};a.prototype.parseInt=function(d,c,b){return a.parseInt.call(this,d,c,b)};a.prototype.parseFloat=function(d,c,b){return a.parseFloat.call(this,d,c,b)};a.prototype.culture=function(b){return a.culture.call(this,b)};a.addCultureInfo=function(a,c,e){var b={},d=false;if(typeof a!=="string"){e=a;a=this.culture().name;b=this.cultures[a]}else if(typeof c!=="string"){e=c;d=this.cultures[a]==null;b=this.cultures[a]||this.cultures["default"]}else{d=true;b=this.cultures[c]}this.cultures[a]=r(true,{},b,e);if(d)this.cultures[a].calendar=this.cultures[a].calendars.standard};a.findClosestCulture=function(a){var e;if(!a)return this.cultures[this.cultureSelector]||this.cultures["default"];if(typeof a==="string")a=a.split(",");if(k(a)){for(var d,h=this.cultures,n=a,i=n.length,g=[],c=0;c<i;c++){a=b(n[c]);var f,j=a.split(";");d=b(j[0]);if(j.length===1)f=1;else{a=b(j[1]);if(a.indexOf("q=")===0){a=a.substr(2);f=parseFloat(a);f=isNaN(f)?0:f}else f=1}g.push({lang:d,pri:f})}g.sort(function(a,b){return a.pri<b.pri?1:-1});for(c=0;c<i;c++){d=g[c].lang;e=h[d];if(e)return e}for(c=0;c<i;c++){d=g[c].lang;do{var m=d.lastIndexOf("-");if(m===-1)break;d=d.substr(0,m);e=h[d];if(e)return e}while(1)}for(c=0;c<i;c++){d=g[c].lang;for(var o in h){var l=h[o];if(l.language==d)return l}}}else if(typeof a==="object")return a;return e||null};a.format=function(a,b,c){culture=this.findClosestCulture(c);if(a instanceof Date)a=n(a,b,culture);else if(typeof a==="number")a=u(a,b,culture);return a};a.localize=function(a,b){return this.findClosestCulture(b).messages[a]||this.cultures["default"].messages[a]};a.parseDate=function(g,a,b){b=this.findClosestCulture(b);var c,h,d;if(a){if(typeof a==="string")a=[a];if(a.length)for(var e=0,i=a.length;e<i;e++){var f=a[e];if(f){c=o(g,f,b);if(c)break}}}else{d=b.calendar.patterns;for(h in d){c=o(g,d[h],b);if(c)break}}return c||null};a.parseInt=function(d,c,b){return q(a.parseFloat(d,c,b))};a.parseFloat=function(a,n,u){if(typeof n!=="number"){u=n;n=10}var k=this.findClosestCulture(u),o=NaN,c=k.numberFormat;if(a.indexOf(k.numberFormat.currency.symbol)>-1){a=a.replace(k.numberFormat.currency.symbol,"");a=a.replace(k.numberFormat.currency["."],k.numberFormat["."])}a=b(a);if(t.test(a))o=parseFloat(a);else if(!n&&x.test(a))o=parseInt(a,16);else{var e=d(a,c,c.pattern[0]),g=e[0],h=e[1];if(g===""&&c.pattern[0]!=="(n)"){e=d(a,c,"(n)");g=e[0];h=e[1]}if(g===""&&c.pattern[0]!=="-n"){e=d(a,c,"-n");g=e[0];h=e[1]}g=g||"+";var l,i,j=h.indexOf("e");if(j<0)j=h.indexOf("E");if(j<0){i=h;l=null}else{i=h.substr(0,j);l=h.substr(j+1)}var f,m,y=c["."],q=i.indexOf(y);if(q<0){f=i;m=null}else{f=i.substr(0,q);m=i.substr(q+y.length)}var r=c[","];f=f.split(r).join("");var v=r.replace(/\u00A0/g," ");if(r!==v)f=f.split(v).join("");var p=g+f;if(m!==null)p+="."+m;if(l!==null){var w=d(l,c,"-n");p+="e"+(w[0]||"+")+w[1]}if(s.test(p))o=parseFloat(p)}return o};a.culture=function(a){if(typeof a!=="undefined")this.cultureSelector=a;return this.findClosestCulture(a)||this.culture["default"]}})(this);
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.3-pre
 */

(function($){

$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });

// old alias
$.fn.bgIframe = $.fn.bgiframe;

function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}

})(jQuery);
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)
;
(function(a){a.fn.extend({wijContent:function(a){return this.each(function(){this.innerHTML='<iframe frameborder="0" style="width: 100%; height: 100%;" src="'+a+'">"'})},wijAddVisibilityObserver:function(c,b){return this.each(function(){a(this).addClass("wijmo-wijobserver-visibility");a(this).bind("wijmovisibilitychanged"+(b?"."+b:""),c)})},wijRemoveVisibilityObserver:function(b){return this.each(function(){a(this).removeClass("wijmo-wijobserver-visibility");if(!b)a(this).unbind("wijmovisibilitychanged");else if(jQuery.isFunction(b))a(this).unbind("wijmovisibilitychanged",b);else a(this).unbind("wijmovisibilitychanged."+b)})},wijTriggerVisibility:function(){return this.each(function(){var b=a(this);b.hasClass("wijmo-wijobserver-visibility")&&b.trigger("wijmovisibilitychanged");b.find(".wijmo-wijobserver-visibility").trigger("wijmovisibilitychanged")})}});var b=function(a){return isNaN(a)?0:a};a.fn.leftBorderWidth=function(){var d=parseFloat(a(this).css("borderLeftWidth")),e=parseFloat(a(this).css("padding-left")),c=0;if(a(this).css("margin-left")!="auto")c=parseFloat(a(this).css("margin-left"));return b(d)+b(e)+b(c)};a.fn.rightBorderWidth=function(){var d=parseFloat(a(this).css("borderRightWidth")),e=parseFloat(a(this).css("padding-right")),c=0;if(a(this).css("margin-right")!="auto")c=parseFloat(a(this).css("margin-right"));return b(d)+b(e)+b(c)};a.fn.topBorderWidth=function(){var d=parseFloat(a(this).css("borderTopWidth")),e=parseFloat(a(this).css("padding-top")),c=0;if(a(this).css("margin-top")!="auto")c=parseFloat(a(this).css("margin-top"));return b(d)+b(e)+b(c)};a.fn.bottomBorderWidth=function(){var d=parseFloat(a(this).css("borderBottomWidth")),e=parseFloat(a(this).css("padding-bottom")),c=0;if(a(this).css("margin-bottom")!="auto")c=parseFloat(a(this).css("margin-bottom"));return b(d)+b(e)+b(c)};a.fn.borderSize=function(){var c=a(this).leftBorderWidth()+a(this).rightBorderWidth(),b=a(this).topBorderWidth()+a(this).bottomBorderWidth(),d={width:c,height:b};return d};a.fn.setOutWidth=function(b){var c=a(this).leftBorderWidth()+a(this).rightBorderWidth();a(this).width(b-c);return this};a.fn.setOutHeight=function(b){var c=a(this).topBorderWidth()+a(this).bottomBorderWidth();a(this).height(b-c);return this};a.fn.getWidget=function(){var a=this.data("widgetName");return a&&a!=""?this.data(a):null};a.fn.wijshow=function(b,e,g,f,d){var c=b.animated||false,h=b.duration||400,i=b.easing,j=b.option||{};f&&a.isFunction(f)&&f.call(this);if(c){if(a.effects&&a.effects[c]){this.show(c,a.extend(j,{easing:i}),h,d);return}if(e&&e[c]){e[c](b,a.extend(g,{complete:d}));return}}this.show();d&&a.isFunction(d)&&d.call(this)};a.fn.wijhide=function(d,e,g,f,c){var b=d.animated||false,h=d.duration||400,i=d.easing,j=d.option||{};f&&a.isFunction(f)&&f.call(this);if(b){if(a.effects&&a.effects[b]){this.hide(b,a.extend(j,{easing:i}),h,c);return}if(e&&e[b]){e[b](newAnimations,a.extend(g,{complete:c}));return}}this.hide();c&&a.isFunction(c)&&c.call(this)};var c=function(){};a.extend(c.prototype,{_UTFPunctuationsString:" ! \" # % & ' ( ) * , - . / : ; ? @ [ \\ ] { } \u00a1 \u00ab \u00ad \u00b7 \u00bb \u00bf \u037e \u0387 \u055a \u055b \u055c \u055d \u055e \u055f \u0589 \u058a \u05be \u05c0 \u05c3 \u05f3 \u05f4 \u060c \u061b \u061f \u066a \u066b \u066c \u066d \u06d4 \u0700 \u0701 \u0702 \u0703 \u0704 \u0705 \u0706 \u0707 \u0708 \u0709 \u070a \u070b \u070c \u070d \u0964 \u0965 \u0970 \u0df4 \u0e4f \u0e5a \u0e5b \u0f04 \u0f05 \u0f06 \u0f07 \u0f08 \u0f09 \u0f0a \u0f0b \u0f0c \u0f0d \u0f0e \u0f0f \u0f10 \u0f11 \u0f12 \u0f3a \u0f3b \u0f3c \u0f3d \u0f85 \u104a \u104b \u104c \u104d \u104e \u104f \u10fb \u1361 \u1362 \u1363 \u1364 \u1365 \u1366 \u1367 \u1368 \u166d \u166e \u169b \u169c \u16eb \u16ec \u16ed \u17d4 \u17d5 \u17d6 \u17d7 \u17d8 \u17d9 \u17da \u17dc \u1800 \u1801 \u1802 \u1803 \u1804 \u1805 \u1806 \u1807 \u1808 \u1809 \u180a \u2010 \u2011 \u2012 \u2013 \u2014 \u2015 \u2016 \u2017 \u2018 \u2019 \u201a \u201b \u201c \u201d \u201e \u201f \u2020 \u2021 \u2022 \u2023 \u2024 \u2025 \u2026 \u2027 \u2030 \u2031 \u2032 \u2033 \u2034 \u2035 \u2036 \u2037 \u2038 \u2039 \u203a \u203b \u203c \u203d \u203e \u2041 \u2042 \u2043 \u2045 \u2046 \u2048 \u2049 \u204a \u204b \u204c \u204d \u207d \u207e \u208d \u208e \u2329 \u232a \u3001 \u3002 \u3003 \u3008 \u3009 \u300a \u300b \u300c \u300d \u300e \u300f \u3010 \u3011 \u3014 \u3015 \u3016 \u3017 \u3018 \u3019 \u301a \u301b \u301c \u301d \u301e \u301f \u3030 \ufd3e \ufd3f \ufe30 \ufe31 \ufe32 \ufe35 \ufe36 \ufe37 \ufe38 \ufe39 \ufe3a \ufe3b \ufe3c \ufe3d \ufe3e \ufe3f \ufe40 \ufe41 \ufe42 \ufe43 \ufe44 \ufe49 \ufe4a \ufe4b \ufe4c \ufe50 \ufe51 \ufe52 \ufe54 \ufe55 \ufe56 \ufe57 \ufe58 \ufe59 \ufe5a \ufe5b \ufe5c \ufe5d \ufe5e \ufe5f \ufe60 \ufe61 \ufe63 \ufe68 \ufe6a \ufe6b \uff01 \uff02 \uff03 \uff05 \uff06 \uff07 \uff08 \uff09 \uff0a \uff0c \uff0d \uff0e \uff0f \uff1a \uff1b \uff1f \uff20 \uff3b \uff3c \uff3d \uff5b \uff5d \uff61 \uff62 \uff63 \uff64';this.UTFWhitespacesString_='\t \13 \f \37   \u00a0 \u1680 \u2000 \u2001 \u2002 \u2003 \u2004 \u2005 \u2006 \u2007 \u2008 \u2009 \u200a \u200b \u2028 \u202f \u3000",isDigit:function(a){return a>="0"&&a<="9"},isLetter:function(a){return!!(a+"").match(new RegExp("[A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u021f\u0222-\u0233\u0250-\u02ad\u02b0-\u02b8\u02bb-\u02c1\u02d0\u02d1\u02e0-\u02e4\u02ee\u037a\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d7\u03da-\u03f3\u0400-\u0481\u048c-\u04c4\u04c7\u04c8\u04cb\u04cc\u04d0-\u04f5\u04f8\u04f9\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0621-\u063a\u0640-\u064a\u0671-\u06d3\u06d5\u06e5\u06e6\u06fa-\u06fc\u0710\u0712-\u072c\u0780-\u07a5\u0905-\u0939\u093d\u0950\u0958-\u0961\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8b\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b36-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cde\u0ce0\u0ce1\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d60\u0d61\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc\u0edd\u0f00\u0f40-\u0f47\u0f49-\u0f6a\u0f88-\u0f8b\u1000-\u1021\u1023-\u1027\u1029\u102a\u1050-\u1055\u10a0-\u10c5\u10d0-\u10f6\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1206\u1208-\u1246\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1286\u1288\u128a-\u128d\u1290-\u12ae\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12ce\u12d0-\u12d6\u12d8-\u12ee\u12f0-\u130e\u1310\u1312-\u1315\u1318-\u131e\u1320-\u1346\u1348-\u135a\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u1780-\u17b3\u1820-\u1877\u1880-\u18a8\u1e00-\u1e9b\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u207f\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2131\u2133-\u2139\u3005\u3006\u3031-\u3035\u3041-\u3094\u309d\u309e\u30a1-\u30fa\u30fc-\u30fe\u3105-\u312c\u3131-\u318e\u31a0-\u31b7\u3400-\u4db5\u4e00-\u9fa5\ua000-\ua48c\uac00-\ud7a3\uf900-\ufa2d\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe72\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]"))},isLetterOrDigit:function(a){return this.isLetter(a)||this.isDigit(a)},isSymbol:function(b){var a=new RegExp("[$+<->^`|~\u00a2-\u00a9\u00ac\u00ae-\u00b1\u00b4\u00b6\u00b8\u00d7\u00f7\u02b9\u02ba\u02c2-\u02cf\u02d2-\u02df\u02e5-\u02ed\u0374\u0375\u0384\u0385\u0482\u06e9\u06fd\u06fe\u09f2\u09f3\u09fa\u0b70\u0e3f\u0f01-\u0f03\u0f13-\u0f17\u0f1a-\u0f1f\u0f34\u0f36\u0f38\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fcf\u17db\u1fbd\u1fbf-\u1fc1\u1fcd-\u1fcf\u1fdd-\u1fdf\u1fed-\u1fef\u1ffd\u1ffe\u2044\u207a-\u207c\u208a-\u208c\u20a0-\u20af\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211e-\u2123\u2125\u2127\u2129\u212e\u2132\u213a\u2190-\u21f3\u2200-\u22f1\u2300-\u2328\u232b-\u237b\u237d-\u239a\u2400-\u2426\u2440-\u244a\u249c-\u24e9\u2500-\u2595\u25a0-\u25f7\u2600-\u2613\u2619-\u2671\u2701-\u2704\u2706-\u2709\u270c-\u2727\u2729-\u274b\u274d\u274f-\u2752\u2756\u2758-\u275e\u2761-\u2767\u2794\u2798-\u27af\u27b1-\u27be\u2800-\u28ff\u2e80-\u2e99\u2e9b-\u2ef3\u2f00-\u2fd5\u2ff0-\u2ffb\u3004\u3012\u3013\u3020\u3036\u3037\u303e\u303f\u309b\u309c\u3190\u3191\u3196-\u319f\u3200-\u321c\u322a-\u3243\u3260-\u327b\u327f\u328a-\u32b0\u32c0-\u32cb\u32d0-\u32fe\u3300-\u3376\u337b-\u33dd\u33e0-\u33fe\ua490-\ua4a1\ua4a4-\ua4b3\ua4b5-\ua4c0\ua4c2-\ua4c4\ua4c6\ufb29\ufe62\ufe64-\ufe66\ufe69\uff04\uff0b\uff1c-\uff1e\uff3e\uff40\uff5c\uff5e\uffe0-\uffe6\uffe8-\uffee\ufffc\ufffd]");return a.test(b+"")},isPunctuation:function(a){return this._UTFPunctuationsString.indexOf(a)>=0},isPrintableChar:function(a){return!this.isLetterOrDigit(a)&&!this.isPunctuation(a)&&!this.isSymbol(a)?a===" ":true},isAscii:function(a){return a>="!"&&a<="~"},isAsciiLetter:function(a){return a>="A"&&a<="Z"||a>="a"&&a<="z"},isUpper:function(a){return a.toUpperCase()===a},isLower:function(a){return a.toLowerCase()===a},isAlphanumeric:function(a){return!this.isLetter(a)?this.isDigit(a):true},isAciiAlphanumeric:function(a){return(a<"0"||a>"9")&&(a<"A"||a>"Z")?a>="a"?a<="z":false:true},setChar:function(a,c,b){return b>=a.length||b<0?a:""||a.substr(0,b)+c+a.substr(b+1)}});var d=["\n","\r",'"',"@","+","'","<",">","%","{","}"],e=["!ESC!NN!","!ESC!RR!","!ESC!01!","!ESC!02!","!ESC!03!","!ESC!04!","!ESC!05!","!ESC!06!","!ESC!07!","!ESC!08!","!ESC!09!"],f=["(\n)","(\r)",'(")',"(@)","(\\+)","(')","(\\<)","(\\>)","(%)","(\\{)","(\\})"];!a.wij&&a.extend({wij:{charValidator:new c,encodeString:function(b){for(var a=0;a<d.lemgth;a++){var c=/c__escapeArr3[i]/g;b=b.replace(c,e[a])}return b},decodeString:function(a){if(a==="")return;for(var b=0;b<e.length;b++){var c=/c__escapeArr2[i]/g;a=a.replace(c,d[b])}return a}}})})(jQuery);__wijReadOptionEvents=function(c,b){for(var a=0;a<c.length;a++)b.options[c[a]]!=null&&b.element.bind(c[a],b.options[c[a]]);for(a in b.options)if(a.indexOf(" ")!=-1)for(var e=a.split(" "),d=0;d<e.length;d++)e[d].length>0&&b.element.bind(e[d],b.options[a])};function wijmoASPNetParseOptionsReviewer(d,c){var a,b=d[c],e;if(b)switch(typeof b){case"string":a=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?):(\d{3})Z$/.exec(b);if(a){e=new Date(+a[1],+a[2]-1,+a[3],+a[4],+a[5],+a[6],+a[7]);e.setFullYear(+a[1]);d[c]=e}break;case"object":if(b.needQuotes!==undefined&&b.valueString!==undefined)if(!b.needQuotes)d[c]=eval(b.valueString);else d[c]=b.valueString;else for(c in b)wijmoASPNetParseOptionsReviewer(b,c)}}function wijmoASPNetParseOptions(a){var b;if(!a)return a;for(b in a)wijmoASPNetParseOptionsReviewer(a,b);return a};
(function(a){"use strict";var g="@wijtp@",b="wijmo-wijtooltip",e=b+"-arrow-",c=parseFloat,i=window,d=document,j=Math,h=j.max,f={};a.widget("wijmo.wijtooltip",{options:{content:"",title:"",closeBehavior:"auto",mouseTrailing:false,triggers:"hover",position:{my:"left bottom",at:"right top",offset:null},showCallout:true,animation:{animated:"fade",duration:500,easing:null},showAnimation:{},hideAnimation:{},showDelay:150,hideDelay:150,calloutAnimation:{duration:1e3,disabled:false,easing:null},calloutFilled:true,modal:false,group:null,ajaxCallback:null,showing:null,shown:null,hiding:null,hidden:null,cssClass:""},_setOption:function(c,f){var b=this,e="_set_"+c,d=b.options[c];a.Widget.prototype._setOption.apply(b,arguments);if(a.isPlainObject(f))b.options[c]=a.extend({},d,f);b[e]&&b[e](d)},_set_cssClass:function(){var c=this,d=c.options,b=d.cssClass,a=c._tooltip;if(!a)return;!a.hasClass(b)&&a.addClass(b)},_set_content:function(){var a=this;if(a._isAjaxCallback){a._callbacked=true;a.show();a._callbacked=false}else a._setText()},_create:function(){var c=this,e=c.options,h=c.element,j=h&&h.attr("id"),d="",f="",i=e.group||g,b=a.wijmo.wijtooltip._getTooltip(i);if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);if(b)b.count++;else{b=c._createTooltip();b.count=0;a.wijmo.wijtooltip._tooltips[i]=b}f=e.cssClass?e.cssClass:"";!b.hasClass(f)&&b.addClass(f);e.position.of=c.element;c._bindLiveEvents();c._tooltip=b;if(j!==""){d=b.attr("aria-describedby");d=d===undefined?"":d+" ";b.attr("aria-describedby",d+j)}},destroy:function(){var b=this,c=b.element,d=b.options.group||g;c.unbind(".tooltip");c.attr("title",b._content);a.wijmo.wijtooltip._removeTooltip(d);a.Widget.prototype.destroy.apply(b)},widget:function(){return this._tooltip},show:function(){var b=this,c=b._tooltip,d=b.options;if(!c||d.disabled)return;if(c._hideAnimationTimer){clearTimeout(c._hideAnimationTimer);c._hideAnimationTimer=null}c.stop(true,true);if(d.ajaxCallback&&a.isFunction(d.ajaxCallback)&&!b._callbacked){b._isAjaxCallback=true;d.ajaxCallback.call(b.element);return}b._setText();c._showAnimationTimer=setTimeout(function(){f=c.offset();if(d.mouseTrailing){b._setCalloutCss();return}b._setPosition();b._showTooltip()},b.options.showDelay)},showAt:function(a){var e=this,b=e._tooltip,n=b&&b._callout,m={},k=0,l=0,o={},g,h,c,d,j,i;if(!b||!n)return;b.stop(true,true);b._showAnimataionTimer=setTimeout(function(){e._setText();f=b.offset();b.offset({left:0,top:0}).show();m=n.position();k=m.left;l=m.top;h=e._getBorder(n);c=h.left||h.right;d=h.top||h.bottom;j=b.width();i=b.height();g=e._getCalloutShape();o=({rt:{left:a.x-j-c,top:a.y-l},rc:{left:a.x-j-c,top:a.y-i/2},rb:{left:a.x-j-c,top:a.y-l-d},lt:{left:a.x+c,top:a.y-l},lc:{left:a.x+c,top:a.y-i/2},lb:{left:a.x+c,top:a.y-l-d},tl:{left:a.x-k,top:a.y+d},tc:{left:a.x-j/2,top:a.y+d},tr:{left:a.x-k-c,top:a.y+d},bl:{left:a.x-k,top:a.y-i-d},bc:{left:a.x-j/2,top:a.y-i-d},br:{left:a.x-k-c,top:a.y-i-d}})[g];g=e._flipTooltip(o,g,h);e._setUnfilledCallout(g);b.offset(o).hide();e._calloutShape=g;e._showTooltip()},e.options.showDelay)},hide:function(){var b=this,c=b._tooltip;if(!c)return;clearTimeout(c._showAnimationTimer);c._hideAnimationTimer=setTimeout(a.proxy(b._hideTooltip,b),b.options.hideDelay)},_createTooltip:function(){var j=this,d="ui-corner-all",f="ui-widget-content",k="ui-state-default",l="ui-widget-header",c=a("<div class = '"+b+" ui-widget "+f+" "+d+"'></div>"),g=a("<div class='"+b+"-container'></div>"),h=a("<div class='"+f+" "+b+"-pointer '><div class='"+b+"-pointer-inner'></div></div>"),i=a("<div class = '"+b+"-title "+l+" "+d+"'></title>"),e=a("<a href='#' class = '"+b+"-close "+k+" "+d+"'></a>");e.append(a("<span class = 'ui-icon ui-icon-close'></span>")).bind("click",a.proxy(j._onClickCloseBtn,j));c.append(i).append(e).append(g).append(h).css("position","absolute").attr("role","tooltip").appendTo("body").hide();c._container=g;c._callout=h;c._closeBtn=e;c._title=i;return c},_bindLiveEvents:function(){var b=this,d=b.options,c=b.element;if(b._content===undefined){b._content=c.attr("title");c.attr("title","")}c.unbind(".tooltip");d.mouseTrailing&&c.bind("mousemove.tooltip",function(a){if(d.disabled)return;var e=d.position.offset||"",c=e.split(" ");if(c.length===2)b.showAt({x:a.pageX+parseInt(c[0],10),y:a.pageY+parseInt(c[1],10)});else b.showAt({x:a.pageX,y:a.pageY})});switch(d.triggers){case"hover":c.bind("mouseover.tooltip",a.proxy(b.show,b)).bind("mouseout.tooltip",a.proxy(b._hideIfNeeded,b));break;case"click":c.bind("click.tooltip",a.proxy(b.show,b));break;case"focus":c.bind("focus.tooltip",a.proxy(b.show,b)).bind("blur.tooltip",a.proxy(b._hideIfNeeded,b));break;case"rightClick":c.bind("contextmenu.tooltip",function(a){b.show();a.preventDefault()})}},_hideIfNeeded:function(){var c=this,a=c.options,b=a.closeBehavior;if(b==="sticky"||a.modal||b==="none"||a.disabled)return;c.hide()},_flipTooltip:function(d,i,e){var h=this,c=h._tooltip,j={width:c.width(),height:c.height()},b=h._flipCallout(d,j,i),a=b&&b.flip,g,f;if(!c||!b||!a.h&&!a.v)return b.calloutShape;g=c.width();f=c.height();if(a.h==="l")d.left-=g+e.right*2+1;else if(a.h==="r")d.left+=g+e.left*2+1;else if(a.v==="t")d.top-=f+e.bottom*2+1;else if(a.v==="b")d.top+=f+e.top*2+1;return b.calloutShape},_flipCallout:function(g,k,b){var h=this,l=h.options,j=h._tooltip,c={h:false,v:false},f=a(i),d=(l.position.collision||"flip").split(" ");if(d.length===1)d[1]=d[0];if(!j||d[0]!=="flip"&&d[1]!=="flip")return{flip:c};if(d[0]==="flip")if(g.left<0||g.left+k.width>f.width()+f.scrollLeft())c.h=true;if(d[0]==="flip")if(g.top<0||g.top+k.height>f.height()+f.scrollTop())c.v=true;if(l.showCallout){if(c.h)if(b.indexOf("l")>-1){b=b.replace(/l/,"r");c.h="l"}else if(b.indexOf("r")>-1){b=b.replace(/r/,"l");c.h="r"}if(c.v)if(b.indexOf("t")>-1){b=b.replace(/t/,"b");c.v="t"}else if(b.indexOf("b")>-1){b=b.replace(/b/,"t");c.v="b"}if(c.h||c.v){h._removeCalloutCss();j.addClass(e+b)}}return{flip:c,calloutShape:b}},_set_position:function(b){var a=this,d=a.options,c=d.position;if(d.showCallout){(b.my!==c.my||b.at!==c.at)&&a._setPosition();a._setCalloutOffset(true)}},_set_showCallOut:function(d){var c=this,b=c._tooltip,a=b&&b._callout;if(!b||!a)return;if(d){c._setCalloutCss();a.show()}else a.hide()},_set_closeBehavior:function(){var c=this,b=c._tooltip,a=b&&b._closeBtn;a&&a[c.options.closeBehavior==="sticky"?"show":"hide"]()},_set_triggers:function(){this._bindLiveEvents()},_set_mouseTrailing:function(){this._bindLiveEvents()},_getCalloutShape:function(){var g=this,e=g.options.position,f=function(b){return a.map(b,function(a){return a.substr(0,1)})},c=f(e.my.split(" ")),d=f(e.at.split(" ")),b=[];if(c.length===2)b=c;if(c[0]===d[0])(c[1]==="t"&&d[1]==="b"||c[1]==="b"&&d[1]==="t")&&b.reverse();else d[0]==="c"&&b.reverse();b[0]==="c"&&b.reverse();return b.join("")},_setCalloutCss:function(){var a=this,f=a.options,d=a._tooltip,c="",b="";if(!f.showCallout)return;a._removeCalloutCss();b=a._getCalloutShape();c=e+b;d&&d.addClass(c);return b},_removeCalloutCss:function(){var b=this._tooltip;b&&a.each(["tl","tc","tr","bl","bc","br","rt","rc","rb","lt","lc","lb"],function(d,c){var a=e+c;if(b.hasClass(a)){b.removeClass(a);return false}})},_getBorder:function(d){var b={};a.each(["top","right","left","bottom"],function(e,a){b[a]=c(d.css("border-"+a+"-width"))});return b},_setPosition:function(){var e=this,m=e.options,d=m.position,a=e._tooltip,p=a.is(":hidden"),f=e._setCalloutCss(),n=f?f.split(""):null,b=[0,0],h="",g=a._callout,i,l,r,q,j,s={width:a.width(),height:a.height()},o,k;p&&a.show();a.css({left:0,top:0});if(m.showCallout){i=e._getBorder(g);r=c(g.css("left"));l=c(g.css("top"));q=c(g.css("right"));j=c(g.css("bottom"));switch(n[0]){case"l":b[0]=i.right;break;case"r":b[0]=-i.left;break;case"b":b[1]=j;break;case"t":b[1]=-l}switch(n[1]){case"t":b[1]=-l;break;case"b":b[1]=j;break;case"r":b[0]=q;break;case"l":b[0]=-r}h=b.join(" ")}a.position({my:d.my,at:d.at,of:d.of,offset:h,collision:"none none"});o=e._flipCallout(a.offset(),s,f);k=o.flip;if(k.h||k.v){a.css({left:0,top:0});a.position({my:d.my,at:d.at,of:d.of,offset:h,collision:d.collision})}m.showCallout&&e._setUnfilledCallout(f);e._calloutShape=f;p&&a.hide()},_setCalloutOffset:function(h){var g=this,k=g.options,j=g._tooltip,e=j&&j._callout,l=g._calloutShape,d=false,f=k.position.offset,c="",b=[],i=k.calloutAnimation;if(!e)return;if(!f||f.length===0)return;e.stop(true,true);a.each(["tr","tc","tl","bl","bc","br"],function(b,a){if(l===a){d=true;return false}});if(f){b=f.split(" ");if(b.length===2)c=d?b[0]:b[1];else if(b.length===1)c=b[0]}if(c!=="")if(h&&!h.disabled)e.animate(d?{left:c}:{top:c},i.duration,i.easing);else e.css(d?"left":"top",c)},_setUnfilledCallout:function(g){var e=this,c=e._tooltip,d=c&&c._callout,a=d&&d.children(),f=g.split(""),b=c&&c.css("background-color");if(!a)return;a.css({"border-left-color":"","border-top-color":"","border-bottom-color":"","border-right-color":""});if(e.options.calloutFilled)switch(f[0]){case"l":a.css("border-right-color",b);break;case"t":a.css("border-bottom-color",b);break;case"r":a.css("border-left-color",b);break;case"b":a.css("border-top-color",b)}},_showTooltip:function(){var c=this,d=c.options,b=c._tooltip,e,g,j,h=b&&b._closeBtn,i=b&&b._callout;if(!b)return;if(c._trigger("showing",null,c)===false)return;h&&h[d.closeBehavior==="sticky"?"show":"hide"]();i&&i[d.showCallout?"show":"hide"]();c._showModalLayer();b.css("z-index",99999);if(!d.mouseTrailing&&a.fn.wijshow){g={show:true,context:b};e=a.extend({},d.animation,d.showAnimation);if(b.is(":visible")){j=b.offset();b.offset(f);a.extend(g,{pos:j});e.animated="tooltipSlide"}b.wijshow(e,a.wijmo.wijtooltip.animations,g,null,function(){c._trigger("shown")})}else{b.show();c._trigger("shown")}c._setCalloutOffset(false)},_hideTooltip:function(){var b=this,d=b.options,c=b._tooltip,f=a.extend({},d.animation,d.hideAnimation),e;if(!c)return;if(b._trigger("hiding",null,b)===false)return;b._hideModalLayer();if(!d.mouseTrailing&&a.fn.wijhide){e={show:true,context:c};c.wijhide(f,a.wijmo.wijtooltip.animations,e,null,function(){b._trigger("hidden");c.css("z-index","")})}else{c.hide();b._trigger("hidden");c.css("z-index","")}},_getContent:function(b){var c={data:""},d;if(a.isFunction(b)){d=b.call(this.element,c);return c.data!==""?c.data:d}else if(window[b]&&a.isFunction(window[b])){d=window[b].call(this.element,c);return c.data!==""?c.data:d}return b},_setText:function(){var b=this,f=b.options,c=b._tooltip,a="",d="",e=c&&c._title;if(!c)return;a=b._getContent(f.content);a=a===""?b._content:a;c._container.html(a);d=b._getContent(f.title);if(d!=="")e.html(d).show();else e.hide()},_showModalLayer:function(){var b=this,c=null;if(b.options.modal){c=a("<div>").addClass("ui-widget-overlay").css("z-index",99e3).width(b._getDocSize("Width")).height(b._getDocSize("Height")).appendTo("body");b._tooltip._modalLayer=c}},_hideModalLayer:function(){var b=this,a=b._tooltip._modalLayer;a&&a.css("z-index","").remove()},_getDocSize:function(b){var c,e,g="documentElement",f="body";if(a.browser.msie&&a.browser.version<9){c=h(d[g]["scroll"+b],d[f]["scroll"+b]);e=h(d[g]["offset"+b],d[f]["offset"+b]);return c<e?a(i)[b.toLowerCase()]()+"px":c+"px"}else return a(d)[b.toLowerCase()]()+"px"},_onClickCloseBtn:function(a){this.hide();a.preventDefault()}});a.extend(a.wijmo.wijtooltip,{animations:{fade:function(b,c){b=a.extend({duration:300,easing:"swing"},b,c);b.context.stop(true,true).animate(b.show?{opacity:"show"}:{opacity:"hide"},b)},tooltipSlide:function(b,c){b=a.extend({duration:300,easing:"swing"},b,c);b.context.stop(true,true).animate({left:b.pos.left,top:b.pos.top},b)}},_tooltips:{},_getTooltip:function(b){return a.wijmo.wijtooltip._tooltips[b]},_removeTooltip:function(c){var b=a.wijmo.wijtooltip._tooltips[c];if(b){b.count--;if(b.count<=0){b.remove();a.wijmo.wijtooltip._tooltips[c]=null}}}})})(jQuery);
(function(a){"use strict";a.widget("wijmo.wijslider",a.ui.slider,{options:{buttonMouseOver:null,buttonMouseOut:null,buttonMouseDown:null,buttonMouseUp:null,buttonClick:null,dragFill:true,minRange:0},_setOption:function(d,c){var b=this;a.ui.slider.prototype._setOption.apply(b,arguments);this.options[d]=c;if(d==="disabled")b._handleDisabledOption(c,b.element.parent());else d==="range"&&b._setRangeOption(c);return this},_setRangeOption:function(d){var c=this,b=c.options;if(d){if(d===true){if(!b.values)b.values=[c._valueMin(),c._valueMin()];if(b.values.length&&b.values.length!==2)b.values=[b.values[0],b.values[0]]}c.range=a("<div></div>").appendTo(c.element).addClass("ui-slider-range ui-widget-header"+(b.range==="min"||b.range==="max"?" ui-slider-range-"+b.range:""))}else c.range.remove();c._refreshValue()},_create:function(){var b=this,c=b.element,d=b.options,i,l,e,g,h,n,m,f,j,k,o;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);b._oriStyle=c.attr("style");if(c.is(":input")){if(d.orientation==="horizontal")i=a("<div></div>").width(c.width()).appendTo(document.body);else i=a("<div></div>").height(c.height()).appendTo(document.body);l=c.val();if(l!=="")try{e=l.split(";");h=e.length;if(h>0){for(g=0;g<h;g++)e[g]=parseInt(e[g],10);if(h===1)d.value=e[0];else d.values=e}}catch(q){}c.data(b.widgetName,i.wijslider(d)).after(a(document.body).children("div:last")).hide();if(d.disabledState){var p=d.disabled;b.disable();d.disabled=p}return}a.ui.slider.prototype._create.apply(b,arguments);c.data("originalStyle",c.attr("style"));c.data("originalContent",c.html());n=c.width();m=c.height();f=a("<div></div>");if(d.orientation==="horizontal")f.addClass("wijmo-wijslider-horizontal");else f.addClass("wijmo-wijslider-vertical");f.width(n).height(m);j=a('<a class="wijmo-wijslider-decbutton"><span></span></a>');k=a('<a class="wijmo-wijslider-incbutton"><span></span></a>');c.wrap(f).before(j).after(k);b._container=c.parent();b._attachClass();o=c.find(".ui-slider-handle");b._adjustSliderLayout(j,k,o);if(d.disabledState){var p=d.disabled;b.disable();d.disabled=p}b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b._refresh();b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijslider");b._bindEvents()},_handleDisabledOption:function(b,c){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv(c);a.disabledDiv.appendTo("body")}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(d){var g=this,b=d?d:g.element,c=b.offset(),f=b.outerWidth(),e=b.outerHeight();return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:f,height:e,left:c.left,top:c.top})},_refresh:function(){var a=this,c,b,d;b=a._container.find(".wijmo-wijslider-decbutton");c=a._container.find(".wijmo-wijslider-incbutton");d=a._container.find(".ui-slider-handle");a._adjustSliderLayout(b,c,d);a._refreshValue()},_adjustSliderLayout:function(e,f,q){var h=this,g=h.element,r=h.options,b,a,d,c,j,i,l,k,o,p,m,n;b=h._container.width();a=h._container.height();d=e.outerWidth();c=e.outerHeight();j=f.outerWidth();i=f.outerHeight();l=q.outerWidth();k=q.outerHeight();if(r.orientation==="horizontal"){o=a/2-c/2;e.css("top",o).css("left",0);p=a/2-i/2;f.css("top",p).css("right",0);g.css("left",d+l/2-1).css("top",a/2-g.outerHeight()/2).width(b-d-j-l-2)}else{m=b/2-d/2;e.css("left",m).css("top",0);n=b/2-j/2;f.css("left",n).css("bottom",0);g.css("left",b/2-g.outerWidth()/2).css("top",c+k/2+1).height(a-c-i-k-2)}},destroy:function(){var b=this,c,d;c=this._getDecreBtn();d=this._getIncreBtn();c.unbind("."+b.widgetName);d.unbind("."+b.widgetName);a.ui.slider.prototype.destroy.apply(this,arguments);a("a",b.element.parent()).remove();b.element.unbind("."+b.widgetName);b.element.unwrap();if(b._oriStyle===undefined)b.element.removeAttr("style");else b.element.attr("style",b._oriStyle);b.element.removeData(b.widgetName).removeData("originalStyle").removeData("originalContent");if(b.disabledDiv){b.disabledDiv.remove();b.disabledDiv=null}},_slide:function(i,f,e){var g=this,h=g.options,c=h.minRange,d=e,b;if(h.range){b=g.values();if(f===0&&b[1]-c<e)d=b[1]-c;else if(f===1&&b[0]+c>e)d=b[0]+c}a.ui.slider.prototype._slide.call(g,i,f,d)},_getDecreBtn:function(){return this.element.parent().find(".wijmo-wijslider-decbutton")},_getIncreBtn:function(){return this.element.parent().find(".wijmo-wijslider-incbutton")},_attachClass:function(){this._getDecreBtn().addClass("ui-corner-all ui-state-default").attr("role","button");this._getIncreBtn().addClass("ui-corner-all ui-state-default").attr("role","button");this.element.parent().attr("role","slider").attr("aria-valuemin",this.options.min).attr("aria-valuenow","0").attr("aria-valuemax",this.options.max);if(this.options.orientation==="horizontal"){this.element.parent().addClass("wijmo-wijslider-horizontal");this._getDecreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-w");this._getIncreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-e")}else{this.element.parent().addClass("wijmo-wijslider-vertical");this._getDecreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-n");this._getIncreBtn().find("> span").addClass("ui-icon ui-icon-triangle-1-s")}},_bindEvents:function(){var a=this,b,c;b=this._getDecreBtn();c=this._getIncreBtn();b.bind("click."+a.widgetName,a,a._decreBtnClick);c.bind("click."+a.widgetName,a,a._increBtnClick);b.bind("mouseover."+a.widgetName,a,a._decreBtnMouseOver);b.bind("mouseout."+a.widgetName,a,a._decreBtnMouseOut);b.bind("mousedown."+a.widgetName,a,a._decreBtnMouseDown);b.bind("mouseup."+a.widgetName,a,a._decreBtnMouseUp);c.bind("mouseover."+a.widgetName,a,a._increBtnMouseOver);c.bind("mouseout."+a.widgetName,a,a._increBtnMouseOut);c.bind("mousedown."+a.widgetName,a,a._increBtnMouseDown);c.bind("mouseup."+a.widgetName,a,a._increBtnMouseUp)},_decreBtnMouseOver:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"decreButton"};a._trigger("buttonMouseOver",d,c);b=a._getDecreBtn();b.addClass("ui-state-hover")},_increBtnMouseOver:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"increButton"};a._trigger("buttonMouseOver",d,c);b=a._getIncreBtn();b.addClass("ui-state-hover")},_decreBtnMouseOut:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"decreButton"};a._trigger("buttonMouseOut",d,c);b=a._getDecreBtn();b.removeClass("ui-state-hover ui-state-active")},_increBtnMouseOut:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"increButton"};a._trigger("buttonMouseOut",d,c);b=a._getIncreBtn();b.removeClass("ui-state-hover ui-state-active")},_decreBtnMouseDown:function(e){var b=e.data,d,c;if(b.options.disabledState)return;d={buttonType:"decreButton"};b._trigger("buttonMouseDown",e,d);c=b._getDecreBtn();c.addClass("ui-state-active");a(document).bind("mouseup."+b.widgetName,{self:b,ele:c},b._documentMouseUp);if(b._intervalID!==null){window.clearInterval(b._intervalID);b._intervalID=null}b._intervalID=window.setInterval(function(){b._decreBtnHandle(b)},200)},_documentMouseUp:function(c){var b=c.data.self,d=c.data.ele;if(b.options.disabledState)return;d.removeClass("ui-state-active");if(b._intervalID!==null){window.clearInterval(b._intervalID);b._intervalID=null}a(document).unbind("mouseup."+b.widgetName,b._documentMouseUp)},_intervalID:null,_increBtnMouseDown:function(e){var b=e.data,d,c;if(b.options.disabledState)return;d={buttonType:"increButton"};b._trigger("buttonMouseDown",e,d);c=b._getIncreBtn();c.addClass("ui-state-active");a(document).bind("mouseup."+b.widgetName,{self:b,ele:c},b._documentMouseUp);if(b._intervalID!==null){window.clearInterval(b._intervalID);b._intervalID=null}b._intervalID=window.setInterval(function(){b._increBtnHandle(b)},200)},_decreBtnMouseUp:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"decreButton"};a._trigger("buttonMouseUp",d,c);b=a._getDecreBtn();b.removeClass("ui-state-active");window.clearInterval(a._intervalID)},_increBtnMouseUp:function(d){var a=d.data,c,b;if(a.options.disabledState)return;c={buttonType:"increButton"};a._trigger("buttonMouseUp",d,c);b=a._getIncreBtn();b.removeClass("ui-state-active");window.clearInterval(a._intervalID)},_decreBtnHandle:function(a){if(a.options.orientation==="horizontal")a._decre();else a._incre()},_decreBtnClick:function(c){var a=c.data,b;if(a.options.disabledState)return;a._mouseSliding=false;a._decreBtnHandle(a);b={buttonType:"decreButton",value:a.value()};a._trigger("buttonClick",c,b)},_increBtnHandle:function(a){if(a.options.orientation==="horizontal")a._incre();else a._decre()},_increBtnClick:function(c){var a=c.data,b;if(a.options.disabledState)return;a._mouseSliding=false;a._increBtnHandle(a);b={buttonType:"increButton",value:a.value()};a._trigger("buttonClick",c,b)},_decre:function(){var a=this.value();if(!this.options.range&&!this.options.values){a=this.value();if(a<=this.options.min)this.value(this.options.min);else this.value(a-this.options.step)}else{a=this.values(0);if(a<=this.options.min)this.values(0,this.options.min);else this.values(0,a-this.options.step)}this.element.parent().attr("aria-valuenow",this.value())},_incre:function(){var a=this.value();if(!this.options.range&&!this.options.values){a=this.value();if(a>=this.options.max)this.value(this.options.max);else this.value(a+this.options.step)}else{a=this.values(1);if(a>=this.options.max)this.values(1,this.options.max);else this.values(1,a+this.options.step)}this.element.parent().attr("aria-valuenow",this.value())},_mouseInit:function(){var b=this;if(this.options.dragFill&&this.options.range){this._preventClickEvent=false;this.element.bind("click."+b.widgetName,function(){if(b._dragFillStart>0)b._dragFillStart=0;else a.ui.slider.prototype._mouseCapture.apply(b,arguments)})}a.ui.mouse.prototype._mouseInit.apply(this,arguments)},_mouseCapture:function(b){this.element.parent().attr("aria-valuenow",this.value());if(this.options.dragFill)if(b.target.className==="ui-slider-range ui-widget-header"){this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();return true}else return a.ui.slider.prototype._mouseCapture.apply(this,arguments);else return a.ui.slider.prototype._mouseCapture.apply(this,arguments)},_dragFillTarget:false,_dragFillStart:0,_rangeValue:0,_oldValue1:0,_oldValue2:0,_oldX:0,_oldY:0,_mouseStart:function(a){if(this.options.dragFill){if(a.target)if(a.target.className==="ui-slider-range ui-widget-header"){this._dragFillTarget=true;this._rangeValue=this.values(1)-this.values(0);this._oldValue1=this.values(0);this._oldValue2=this.values(1);this._oldX=a.pageX;this._oldY=a.pageY;return true}this._dragFillTarget=false}return true},_mouseDrag:function(f){var d,c,e,b,g,h;if(this.options.dragFill){d=f.pageX-this._oldX;c=this.element.outerWidth();if(this.options.orientation==="vertical"){c=this.element.outerHeight();d=-(f.pageY-this._oldY)}e=(this.options.max-this.options.min)/c*d;if(this._dragFillTarget){if(this.options.orientation==="vertical")a(document.documentElement).css("cursor","s-resize");else a(document.documentElement).css("cursor","w-resize");if(this._dragFillStart>0){b=this._rangeValue;this.values(0,this._oldValue1+e);this.values(1,this._oldValue1+e+b);g=this.values(0);h=this.values(1);g+b>this.options.max&&this.values(0,this.options.max-b);h-b<this.options.min&&this.values(1,this.options.min+b)}this._dragFillStart++;return false}else return a.ui.slider.prototype._mouseDrag.apply(this,arguments)}else return a.ui.slider.prototype._mouseDrag.apply(this,arguments)},_mouseStop:function(){var b=a.ui.slider.prototype._mouseStop.apply(this,arguments);if(this.options.dragFill){a(document.documentElement).css("cursor","default");window.setTimeout(function(){this._dragFillTarget=false;this._dragFillStart=0},500)}return b}})})(jQuery);
(function(a){"use strict";var j="wijmo-wijsplitter-",t=j+"wrapper",m=j+"horizontal",n=j+"vertical",c=j+"h-",b=j+"v-",o="-content",d={panel1:{n:"panel1",content:"panel1"+o},panel2:{n:"panel2",content:"panel2"+o}},v="bar",s="expander",r="ui-widget-header",g="ui-widget-content",q="ui-state-default",h="ui-state-hover",l="ui-state-active",e="ui-corner-",u="ui-icon",k="ui-icon-triangle-1-",i="collapsed",f="expanded",p="resize-helper";a.widget("wijmo.wijsplitter",{options:{sizing:null,sized:null,expand:null,collapse:null,expanded:null,collapsed:null,barZIndex:-1,showExpander:true,splitterDistance:100,orientation:"vertical",fullSplit:false,resizeSettings:{animationOptions:{duration:100,easing:"swing",disabled:false},ghost:false},panel1:{minSize:1,collapsed:false,scrollBars:"auto"},panel2:{minSize:1,collapsed:false,scrollBars:"auto"},collapsingPanel:"panel1"},_setOption:function(c,d){var b=this,f=b.options,e,g=a.extend({},f[c]);if(c==="fullSplit")b._setFullSplit(d);else if(a.isPlainObject(f[c])){if(c==="panel1"&&d.collapsed!==undefined)b._setPanel1Collapsed(d.collapsed);else c==="panel2"&&d.collapsed!==undefined&&b._setPanel2Collapsed(d.collapsed);f[c]=a.extend(true,f[c],d);return}a.Widget.prototype._setOption.apply(b,arguments);if(g!==d)if(c==="orientation")b.refresh();else if(c==="collapsingPanel")b.refresh();else if(c==="fullSplit")b.refresh(true,false);else if(c==="splitterDistance"){b.refresh(false,false);b._trigger("sized")}else if(c==="showExpander"){e=b._fields.expander;e&&e.length&&e.css("display",d?"":"none")}c==="disabled"&&b._handleDisabledOption(d,b.element)},_create:function(){var b=this,c=b.element,d=b.options;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);b._fields={width:c.width(),height:c.height()};d.fullSplit&&b._setFullSplit(true);b._splitterify();b._updateElementsCss();b._updateElements();b._bindEvents();b._initResizer();d.disabled&&b.disable();b._trigger("load",null,b)},_handleDisabledOption:function(b,c){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv(c);a.disabledDiv.appendTo("body")}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(d){var g=this,b=d?d:g.element,c=b.offset(),f=b.outerWidth(),e=b.outerHeight();return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:f,height:e,left:c.left,top:c.top})},destroy:function(){var e=this,j=e.element,d=e._fields,s=d.wrapper,r=d.expander,t=d.bar,f=d.panel1,q=d.panel2,p=d.originalStyle,k=e.widgetName,h=d.oriPnl1Content,i=d.oriPnl2Content,l=d.oriPnl1ContentStyle,o=d.oriPnl2ContentStyle;f&&f.n.is(":ui-resizable")&&f.n.resizable("destroy");if(h){h.removeClass(b+f.contentCss+" "+c+f.contentCss+" "+g);if(l===undefined)h.removeAttr("style");else h.attr("style",l);h.appendTo(j)}if(i){i.removeClass(b+q.contentCss+" "+c+q.contentCss+" "+g);if(o===undefined)i.removeAttr("style");else i.attr("style",o);i.appendTo(j)}f.n.unbind("."+k);r.unbind("."+k);t.unbind("."+k);a(window).unbind("."+k);s.remove();j.removeClass(n+" "+m);if(p===undefined)j.removeAttr("style");else j.attr("style",p);if(e.disabledDiv){e.disabledDiv.remove();e.disabledDiv=null}e._fields=null},refresh:function(e,d){var a=this,c=a._fields,b=c.panel1;if(c._isResizing)return;(d||d===undefined)&&a._updateElementsCss();a._updateElements();if(e||e===undefined){b&&b.n.is(":ui-resizable")&&b.n.resizable("destroy");a._initResizer()}},_splitterify:function(){var i=this,f=i.element,k=i.options,b=i._fields,e,g,h,j,c={n:null,content:f.find(">div:eq(0)")},d={n:null,content:f.find(">div:eq(1)")};b.originalStyle=f.attr("style");e=a("<div></div>").appendTo(f);c.n=a("<div></div>").appendTo(e);if(c.content.length===0)c.content=a("<div></div>");else{b.oriPnl1Content=c.content;b.oriPnl1ContentStyle=c.content.attr("style")}c.content.appendTo(c.n);g=a("<div></div>").appendTo(e);k.barZIndex!==-1&&g.css("z-index",k.barZIndex);h=a("<div></div>").appendTo(g).attr("role","button");j=a("<span></span>").appendTo(h);d.n=a("<div></div>").appendTo(e);if(d.content.length===0)d.content=a("<div></div>");else{b.oriPnl2Content=d.content;b.oriPnl2ContentStyle=d.content.attr("style")}d.content.appendTo(d.n);b.wrapper=e;b.panel1=c;b.panel2=d;b.bar=g;b.expander=h;b.icon=j},_updateElementsCss:function(){var j=this,p=j.element,l=j.options,f=l.orientation==="vertical",i=j._fields,w=i.wrapper,a=l.collapsingPanel,h=l.collapsingPanel==="panel1"?"panel2":"panel1",y=i.bar,o=i.expander,x=i.icon;p.removeClass(n+" "+m).addClass(f?n:m);w.attr("class",t);i[a].n.removeClass(b+d[a].n+" "+c+d[a].n).addClass((f?b:c)+d[a].n);i[a].content.removeClass(b+d[a].content+" "+c+d[a].content+" "+g).addClass((f?b:c)+d[a].content+" "+g);y.attr("class",(f?b:c)+v+" "+r).css("width","").css("height","");o.attr("class",e+(f?"bl "+b:"tr "+c)+s+" "+q).css("left","").css("top","");x.attr("class",u+" "+k+(f?"w":"n"));i[h].n.removeClass(b+d[h].n+" "+c+d[h].n).addClass((f?b:c)+d[h].n);i[h].content.removeClass(b+d[h].content+" "+c+d[h].content+" "+g).addClass((f?b:c)+d[h].content+" "+g);j._updateExpanderCss()},_updateExpanderCss:function(){var t=this,a=t.options,s=t._fields,j=s.expander,l=s.icon,g=a.orientation==="vertical",d=a.collapsingPanel!=="panel1",h=g?b:c,m=(["bl","tr","tr","bl"])[g*2+d],n=(["br","tl"])[+d],q=(["s","n","e","w"])[g*2+d],o=(["tr","bl","bl","tr"])[g*2+d],p=(["tl","br"])[+d],r=(["n","s","w","e"])[g*2+d];j.removeClass(h+a.collapsingPanel+"-"+f+" "+h+a.collapsingPanel+"-"+i+" "+e+m+" "+e+n+" "+e+o+" "+e+p);l.removeClass(k+q+" "+k+r);if(a.panel1.collapsed||a.panel2.collapsed){j.addClass(e+m+" "+e+n+" "+h+a.collapsingPanel+"-"+i);l.addClass(k+q)}else{j.addClass(e+o+" "+e+p+" "+h+a.collapsingPanel+"-"+f);l.addClass(k+r)}},_updateElements:function(){var n=this,p=n.element,h=n.options,d=h.splitterDistance,k=h.collapsingPanel,r=h.collapsingPanel==="panel1"?"panel2":"panel1",a=n._fields,q=a.wrapper,s=a.panel1,t=a.panel2,o=a.bar,g=a.expander,j=p.width(),e=p.height(),m,l;q.height(e);n._setPanelsScrollMode();if(h.orientation==="vertical"){m=o.outerWidth(true);if(d>j-m)d=j-m;q.width(j*2);if(h.panel1.collapsed){k==="panel1"&&g.addClass(b+"panel1-"+i);a.panel1.n.css("display","none");a.panel2.n.css("display","");d=0}else{k==="panel1"&&g.addClass(b+"panel1-"+f);a.panel1.n.css("display","");a.panel2.n.css("display",h.panel2.collapsed?"none":"")}if(h.panel2.collapsed){k==="panel2"&&g.addClass(b+"panel2-"+i);a.panel2.n.css("display","none");d=k==="panel1"?j-m:j}else{k==="panel2"&&g.addClass(b+"panel2-"+f);a.panel2.n.css("display","")}!h.panel1.collapsed&&!h.panel2.collapsed&&g.addClass(b+h.collapsingPanel+"-"+f);if(k==="panel1"){a.panel1.n.height(e).width(d);a.panel2.n.height(e).width(j-d-m)}else{a.panel1.n.height(e).width(d-m);a.panel2.n.height(e).width(j-d);a.panel2.content.width(j-d)}a.panel1.content.outerHeight(e,true);o.outerHeight(e,true);a.panel2.content.outerHeight(e,true);g.css("cursor","pointer").css("top",e/2-g.outerHeight(true)/2)}else{l=o.outerHeight(true);if(d>e-l)d=e-l;if(h.panel1.collapsed){k==="panel1"&&g.addClass(c+"panel1-"+i);a.panel1.n.css("display","none");a.panel2.n.css("display","");d=0}else{k==="panel1"&&g.addClass(c+"panel1-"+f);a.panel1.n.css("display","");a.panel2.n.css("display",h.panel2.collapsed?"none":"")}if(h.panel2.collapsed){k==="panel2"&&g.addClass(c+"panel2-"+i);a.panel2.n.css("display","none");d=k==="panel1"?e-l:e}else{k==="panel2"&&g.addClass(c+"panel2-"+f);a.panel2.n.css("display","")}if(k==="panel1"){a.panel1.n.width(j).height(d);a.panel2.n.width(j).height(e-d-l);a.panel1.content.outerHeight(d,true);a.panel2.content.outerHeight(e-d-l,true)}else{a.panel1.n.width(j).height(d-l);a.panel2.n.width(j).height(e-d);a.panel1.content.outerHeight(d-l,true);a.panel2.content.outerHeight(e-d,true)}g.css("cursor","pointer").css("left",j/2-g.outerWidth(true)/2)}g.css("display",h.showExpander?"":"none")},_setFullSplit:function(b){var c=this,a=c._fields,e=b?"100%":a.width,d=b?"100%":a.height;c.element.css("width",e).css("height",d)},_setPanel1Collapsed:function(d,g){var b=this,c=b.options,f=c.panel1.collapsed,e=a(".ui-resizable-handle",b.element);if(f===d)return;if(c.collapsingPanel==="panel1")if(!b._trigger(f?"expand":"collapse",g,null))return;c.panel1.collapsed=d;if(d){c.panel2.collapsed=false;c.collapsingPanel==="panel2"&&e.hide()}else e.show();b._updateElements();b._updateExpanderCss();c.collapsingPanel==="panel1"&&b._trigger(d?"collapsed":"expanded",g,null)},_setPanel2Collapsed:function(d,g){var b=this,c=b.options,f=c.panel2.collapsed,e=a(".ui-resizable-handle",b.element);if(f===d)return;if(c.collapsingPanel==="panel2")if(!b._trigger(f?"expand":"collapse",g,null))return;c.panel2.collapsed=d;if(d){c.panel1.collapsed=false;c.collapsingPanel==="panel1"&&e.hide()}else e.show();b._updateElements();b._updateExpanderCss();c.collapsingPanel==="panel2"&&b._trigger(d?"collapsed":"expanded",g,null)},_bindEvents:function(){var c=this,b=c.options,g=c._fields,f=g.bar,e=g.expander,d=c.widgetName;e.bind("mouseover."+d,function(){if(b.disabled)return;e.addClass(h)}).bind("mouseout."+d,function(){if(b.disabled)return;e.removeClass(h).removeClass(l)}).bind("mousedown."+d,function(){if(b.disabled)return;e.addClass(l)}).bind("mouseup."+d,function(a){if(b.disabled)return;e.removeClass(l);if(b.collapsingPanel==="panel1")c._setPanel1Collapsed(!b.panel1.collapsed,a);else c._setPanel2Collapsed(!b.panel2.collapsed,a)});f.bind("mouseover."+d,function(){if(b.disabled)return;f.addClass(h)}).bind("mouseout."+d,function(){if(b.disabled)return;f.removeClass(h)});g.panel1.n.bind("animating."+d,function(a){if(b.disabled)return;c._adjustLayout(c);c._trigger("sizing",a,null)}).bind("animated."+d,function(a){if(b.disabled)return;c._adjustLayout(c);c._trigger("sized",a,null)});a(".ui-resizable-handle",c.element).live("mouseover."+d,function(){if(b.disabled)return;f.addClass(h)}).live("mouseout."+d,function(){if(b.disabled)return;f.removeClass(h)});a(window).bind("resize."+d,function(){if(b.disabled)return;if(b.fullSplit){c._updateElements();c._initResizer()}})},_initResizer:function(){var m=this,h=m.element,d=m.options,e=m._fields,u=e.bar,n=d.collapsingPanel,l=d.collapsingPanel==="panel1"?"panel2":"panel1",k=d.resizeSettings,g=k.animationOptions,o=g.disabled?0:g.duration,w=h.width(),v=h.height(),r,t,j,q,s,i,f;if(d.orientation==="vertical"){r=u.outerWidth(true);t=w-r-d[l].minSize;j=d[n].minSize;if(j<2)j=2;e.panel1.n.resizable({wijanimate:true,minWidth:j,maxWidth:t,handles:"e",helper:b+p,animateDuration:o,animateEasing:g.easing,ghost:k.ghost,start:function(){e._isResizing=true},stop:function(){e._isResizing=false}})}else{q=u.outerHeight(true);s=v-q-d[l].minSize;i=d[n].minSize;if(i<2)i=2;e.panel1.n.resizable({wijanimate:true,minHeight:i,maxHeight:s,handles:"s",helper:c+p,animateDuration:o,animateEasing:g.easing,ghost:k.ghost,start:function(){e._isResizing=true},stop:function(){e._isResizing=false}})}f=a(".ui-resizable-handle",h);if(d[l].collapsed)f.hide();else f.show();if(a.browser.msie&&a.browser.version<7)d.orientation==="vertical"&&f.height(h.height())},_adjustLayout:function(a){var b=a.options,e=a._fields,d=e.panel1,c=b.orientation==="vertical"?d.n.width():d.n.height();if(b.splitterDistance===c)return;b.splitterDistance=c;a._updateElements()},_setPanelsScrollMode:function(){var d=this,c=d._fields,e=d.options,b=[e.panel1.scrollBars,e.panel2.scrollBars];a.each([c.panel1,c.panel2],function(a,c){if(b[a]==="auto")c.content.css("overflow","auto");else if(b[a]==="both")c.content.css("overflow","scroll");else if(b[a]==="none")c.content.css("overflow","hidden");else if(b[a]==="horizontal")c.content.css("overflow-x","scroll").css("overflow-y","hidden");else b[a]==="vertical"&&c.content.css("overflow-x","hidden").css("overflow-y","scroll")})}})})(jQuery);(function(a){"use strict";a.ui.plugin.add("resizable","wijanimate",{stop:function(l){var b=a(this).data("resizable"),i=b.options,c=b.element,d=b._proportionallyResizeElements,h=d.length&&/textarea/i.test(d[0].nodeName),j=h&&a.ui.hasScroll(d[0],"left")?0:b.sizeDiff.height,k=h?0:b.sizeDiff.width,g,e,f;c.css("width",b.originalSize.width).css("height",b.originalSize.height);g={width:b.size.width-k,height:b.size.height-j};e=parseInt(c.css("left"),10)+(b.position.left-b.originalPosition.left)||null;f=parseInt(c.css("top"),10)+(b.position.top-b.originalPosition.top)||null;c.animate(a.extend(g,f&&e?{top:f,left:e}:{}),{duration:i.animateDuration,easing:i.animateEasing,step:function(){var e={width:parseInt(c.css("width"),10),height:parseInt(c.css("height"),10),top:parseInt(c.css("top"),10),left:parseInt(c.css("left"),10)};d&&d.length&&a(d[0]).css({width:e.width,height:e.height});b._updateCache(e);b._propagate("resize",l);c.trigger("animating")},complete:function(){c.trigger("animated")}})}})})(jQuery);
(function(a){"use strict";var b="wijmo-wijprogressbar",j="ui-progressbar",i=j+"-label",c=b+"-lb-",d="ui-corner-",g=d+"left",f=d+"right",h=d+"top",e=d+"bottom";a.widget("wijmo.wijprogressbar",a.ui.progressbar,{options:{labelAlign:"center",maxValue:100,minValue:0,fillDirection:"east",labelFormatString:"{1}%",toolTipFormatString:"{1}%",indicatorIncrement:1,indicatorImage:"",animationDelay:0,animationOptions:{disabled:false,easing:null,duration:500},progressChanging:null,beforeProgressChanging:null,progressChanged:null},_setOption:function(c,d){var b=this,e=b.options,f;switch(c){case"value":e[c]=parseInt(d,10);b._refreshValue();return;case"maxValue":e.max=d;case"minValue":f=parseInt(d,10);e[c]=f;b[c==="maxValue"?"max":"min"]=f;b._refreshValue(true);return;case"labelFormatString":case"toolTipFormatString":e[c]=d;b._refreshValue(true);return;case"fillDirection":case"labelAlign":case"indicatorImage":e[c]=d;b._updateElementsCss();return}a.Widget.prototype._setOption.apply(b,arguments);c==="disabled"&&b._handleDisabledOption(d,b.element)},_create:function(){var c=this,d=c.options,e=c.element;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);c.directions={east:"left",west:"right",north:"bottom",south:"top"};c.min=d.minValue;c.max=d.max=d.maxValue;e.addClass(b);a.ui.progressbar.prototype._create.apply(c,arguments);c.label=a("<span>").addClass(i).appendTo(e);c._updateElementsCss();c._isInit=true;d.disabled&&c.disable();c._refreshValue()},_handleDisabledOption:function(b,c){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv(c);a.disabledDiv.appendTo("body")}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(d){var g=this,b=d?d:g.element,c=b.offset(),f=b.outerWidth(),e=b.outerHeight();return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:f,height:e,left:c.left,top:c.top})},_triggerEvent:function(a,c,b){return this._trigger(a,null,{oldValue:c,newValue:b})===false},_refreshValue:function(i){var b=this,g=b.options,f=g.animationOptions,h=b.element,c,e,d;if(!b._isInit)return;d=h.attr("aria-valuenow");c=b.value();e=(c-b.min)/(b.max-b.min)*100;if(b._triggerEvent("beforeProgressChanging",d,c))return;if(!f.disabled&&f.duration>0)setTimeout(function(){a.wijmo.wijprogressbar.animations.progress({content:b.valueDiv,complete:function(){b._triggerEvent("progressChanged",d,c);b._lastStep=e},step:function(a){b._performAnimating(a,i)},progressValue:c*100},f)},g.animationDelay);else{b._refreshProgress(Math.round(e));b._lastStep=e;b._triggerEvent("progressChanged",d,c)}},_refreshProgress:function(d,c){var b=this,i=b.options,j=i.fillDirection,k=b.element;if(c===undefined)c=a.wijmo.wijprogressbar.mul(d,b.max-b.min)/100+b.min;if(b._triggerEvent("progressChanging",k.attr("aria-valuenow"),c))return;if(b._isHorizontal())b.valueDiv.toggleClass(j==="east"?f:g,c===b.max).width(d+"%");else b.valueDiv.toggleClass(j==="south"?e:h,c===b.max).height(d+"%");b.label.html(b._getFormatString(i.labelFormatString,d,c));k.attr("aria-valuenow",c).attr("title",b._getFormatString(i.toolTipFormatString,d,c))},_isHorizontal:function(){var a=this.options.fillDirection;return a==="west"||a==="east"},_getRotateTextOffset:function(a){var c,b;a.css("width","auto");c=a.outerWidth();b=a.outerHeight();a.css("width","");return Math.max(c-b-4,0)},_updateElementsCss:function(){var a=this,e=a.options,d=a.element,c=e.fillDirection;d.removeClass(b+"-west "+b+"-east "+b+"-north "+b+"-south").addClass(b+"-"+c);a._updateProgressCss();a._updateLabelCss()},_updateLabelCss:function(){var d=this,i=d.options,g=d.element,b=i.labelAlign,e=d.label,f=d._lastStep,h=g.height();e.removeClass(c+"west "+c+"east "+c+"south "+c+"north "+c+"center "+c+"running").addClass(c+b).css({left:"",right:"",top:"",bottom:"",width:"","text-align":"","line-height":""});b!=="north"&&b!=="south"&&!(b==="running"&&!d._isHorizontal())&&e.css("line-height",h+"px");if(b==="running")d._updateRunningLabelCss(f);else if(!d._isHorizontal()&&!a.browser.msie)if(b==="north")e.css("width","100%").css("text-align","right");else b==="south"&&e.css("width","100%").css("text-align","left")},_updateRunningLabelCss:function(l){var b=this,m=b.options,i=m.fillDirection,k=b.element,f=b.label,j=b.valueDiv,e=b._isHorizontal(),c,d,g,h;c=k[e?"width":"height"]();d=f[e?"outerWidth":"outerHeight"]();g=j[e?"outerWidth":"outerHeight"]();if(!e&&!a.browser.msie)d+=b._getRotateTextOffset(f);h=c===g?c-d:l*c/100-d+d*(c-g)/c;f.css(b.directions[i],h)},_updateProgressCss:function(){var b=this,j=b.options,k=j.fillDirection,i=j.indicatorImage,a=b.valueDiv,c=b._lastStep;i!==""&&a.css("background","transparent url("+i+") repeat fixed");a.removeClass(g+" "+f+" "+h+" "+e).addClass(d+b.directions[k]);if(c)if(b._isHorizontal())a.css("width",c+"%").css("height","");else a.css("height",c+"%").css("width","");else a.css({width:"",height:""})},_performAnimating:function(l,k){var c=this,j=c.options,d=j.indicatorIncrement,i=l/100,b=a.wijmo.wijprogressbar.div(i-c.min,c.max-c.min)*100,f=0,g,h,e=2;if(d){g=b.toString().split(".");if(g.length===2){f=g[1].length;e=f}h=Math.pow(10,f);if(d!==1)b=Math.floor(b*h/d)*d/h;else{b=Math.round(b);e=0}c.pointNumber=f;if(c._lastStep===b&&!k)return}c._refreshProgress(Number(b.toFixed(e)),Number(i.toFixed(e)));j.labelAlign==="running"&&c._updateRunningLabelCss(b)},_getFormatString:function(a,d,e){var c=this,g=c.max-e,f=100-d,b=/\{0\}/g;a=a.replace(b,e.toString());b=/\{ProgressValue\}/g;a=a.replace(b,e.toString());b=/\{1\}/g;a=a.replace(b,d.toString());b=/\{PercentProgress\}/g;a=a.replace(b,d.toString());b=/\{2\}/g;a=a.replace(b,g.toString());b=/\{RemainingProgress\}/g;a=a.replace(b,g.toString());b=/\{3\}/g;a=a.replace(b,f.toString());b=/\{PercentageRemaining\}/g;a=a.replace(b,f.toString());b=/\{4\}/g;a=a.replace(b,c.min);b=/\{Min\}/g;a=a.replace(b,c.min);b=/\{5\}/g;a=a.replace(b,c.max);b=/\{Max\}/g;a=a.replace(b,c.max);return a},destroy:function(){var c=this,d=c.element;d.attr("title","").removeClass(b+" "+b+"-east "+b+"-west "+b+"-north "+b+"-south");c.label&&c.label.remove();if(c.disabledDiv){c.disabledDiv.remove();c.disabledDiv=null}a.ui.progressbar.prototype.destroy.apply(this,arguments)}});a.extend(a.wijmo.wijprogressbar,{animations:{progress:function(b,c){b=a.extend({easing:"swing",duration:1e3},b,c);b.content.stop(true,true).animate({pgvalue:b.progressValue},b)}},add:function(b,c){var d=0,e=0,a;try{d=b.toString().split(".")[1].length}catch(g){}try{e=c.toString().split(".")[1].length}catch(f){}a=Math.pow(10,Math.max(d,e));return(b*a+c*a)/a},mul:function(d,e){var a=0,b=d.toString(),c=e.toString();try{a+=b.split(".")[1].length}catch(g){}try{a+=c.split(".")[1].length}catch(f){}return Number(b.replace(".",""))*Number(c.replace(".",""))/Math.pow(10,a)},div:function(a,b){var e=0,f=0,c,d;try{e=a.toString().split(".")[1].length}catch(h){}try{f=b.toString().split(".")[1].length}catch(g){}c=Number(a.toString().replace(".",""));d=Number(b.toString().replace(".",""));return c/d*Math.pow(10,f-e)}})})(jQuery);
(function(a){"use strict";var b="ui-state-hover",c="wijmo-wijdialog-defaultdockingzone";a.widget("wijmo.wijdialog",a.ui.dialog,{options:{captionButtons:{},collapsingAnimation:null,expandingAnimation:null,contentUrl:"",minimizeZoneElementId:"",buttonCreating:null,stateChanged:null,blur:null},_create:function(){var b=this,c=b.options;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);a.isArray(c.buttons)&&a.each(c.buttons,function(c,b){var a=b.click;if(a&&typeof a==="string"&&window[a])b.click=window[a]});b.form=b.element.closest("form[id]");a.ui.dialog.prototype._create.apply(b,arguments);b.uiDialog.addClass("wijmo-wijdialog");b._initWijWindow();b._bindWindowResize();b._attachDraggableResizableEvent();b.originalPosition=c.position;b.isPin=false;b.form.length&&b.uiDialog.appendTo(b.form)},_makeDraggable:function(){a.ui.dialog.prototype._makeDraggable.apply(this,arguments);this.uiDialog.draggable("option","cancel",".wijmo-wijdialog-captionbutton")},_handleDisabledOption:function(b){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv();a.disabledDiv.appendTo("body")}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(){var f=this,b=f.uiDialog,c=b.offset(),e=b.outerWidth(),d=b.outerHeight();return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:e,height:d,left:c.left,top:c.top})},destroy:function(){var b=this;if(b.disabledDiv){b.disabledDiv.remove();b.disabledDiv=null}a.ui.dialog.prototype.destroy.apply(b,arguments);b.element.unbind(".wijdialog").removeData("wijdialog")},_attachDraggableResizableEvent:function(){var a=this,b=a.uiDialog,c=a.options;c.draggable&&b.draggable&&b.bind("dragstop",function(){a._saveNormalState();a._destoryIframeMask()}).bind("dragstart",function(){a._createIframeMask()});c.resizable&&b.resizable&&b.bind("resizestop",function(){a._saveNormalState();a._destoryIframeMask()}).bind("resizestart",function(){a._createIframeMask()})},_createIframeMask:function(){var b=this;if(b.innerFrame)b.mask=a("<div style='width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:"+(a.ui.dialog.maxZ+1)+"'></div>").appendTo(b.uiDialog)},_destoryIframeMask:function(){var a=this;if(a.innerFrame&&a.mask){a.mask.remove();a.mask=undefined}},_initWijWindow:function(){var b=this,c=true;b._createCaptionButtons();b._checkUrl();b.uiDialogButtonPane=a(".ui-dialog-buttonpane",b.uiDialog);b.uiDialog.bind("mousedown",function(c){var d=c.target;!a.contains(b.element[0],d)&&b.uiDialog.focus()}).bind("mouseenter",function(){c=true}).bind("mouseleave",function(){c=false}).bind("focusout",function(a){!c&&b._trigger("blur",a,{el:b.element})})},_checkUrl:function(){var b=this,e=b.options,d=e.contentUrl,c=a('<iframe style="width:100%;height:99%;" frameborder="0"></iframe>');if(typeof d==="string"&&d.length>0){b.element.addClass("wijmo-wijdialog-hasframe");b.element.append(c);b.innerFrame=c}b.contentWrapper=b.element},_setOption:function(d,c){var b=this;a.ui.dialog.prototype._setOption.apply(b,arguments);if(d==="disabled")b._handleDisabledOption(c,b.element);else if(d==="contentUrl")if(b.innerFrame)b.innerFrame.attr("src",c);else b._checkUrl()},_createCaptionButtons:function(){var c=[],b=this,h=b.options,d,g={pin:{visible:true,click:b.pin,iconClassOn:"ui-icon-pin-w",iconClassOff:"ui-icon-pin-s"},refresh:{visible:true,click:b.refresh,iconClassOn:"ui-icon-refresh"},toggle:{visible:true,click:b.toggle,iconClassOn:"ui-icon-carat-1-n",iconClassOff:"ui-icon-carat-1-s"},minimize:{visible:true,click:b.minimize,iconClassOn:"ui-icon-minus"},maximize:{visible:true,click:b.maximize,iconClassOn:"ui-icon-extlink"},close:{visible:true,click:b.close,iconClassOn:"ui-icon-close"}},e=h.captionButtons,f=b.uiDialogTitlebar;f.children(".ui-dialog-titlebar-close, .wijmo-wijdialog-captionbutton").remove();a.each(g,function(b,d){e&&e[b]&&a.extend(d,e[b]);c.push({button:b,info:d})});b._trigger("buttonCreating",null,c);for(d=0;d<c.length;d++)b._createCaptionButton(c[d],f)},_createCaptionButton:function(f,g,k){var j=this,d,h="wijmo-wijdialog-titlebar-"+f.button,i=g.children("."+h),c=f.info,e=a("<span></span>");if(c.visible){if(i.size()===0){e.addClass("ui-icon "+c.iconClassOn).text(c.text||f.button);d=a('<a href="#"></a>').append(e).addClass(h+" ui-corner-all wijmo-wijdialog-captionbutton").attr("role","button").hover(function(){d.addClass(b)},function(){d.removeClass(b)}).click(function(){if(e.hasClass(c.iconClassOff))e.removeClass(c.iconClassOff);else e.addClass(c.iconClassOff);a.isFunction(c.click)&&c.click.apply(j,arguments);return false});if(k)return d;else d.appendTo(g)}j[f.button+"Button"]=d}else i.remove()},pin:function(){var a=this.isPin;this._enableDisableDragger(!a);this.isPin=!a},refresh:function(){var a=this.innerFrame;a!==undefined&&a.attr("src",a.attr("src"))},toggle:function(){var a=this,b=a.toggleButton.children("span");if(!a.minimized)if(a.collapsed===undefined||!a.collapsed){a.collapsed=true;!b.hasClass("ui-icon-carat-1-s")&&b.addClass("ui-icon-carat-1-s");a._collapseDialogContent(true)}else{a.collapsed=false;b.hasClass("ui-icon-carat-1-s")&&b.removeClass("ui-icon-carat-1-s");a._expandDialogContent(true)}},_expandDialogContent:function(e){var b=this,d=b.options,c=d.expandingAnimation;b.uiDialog.height("auto");if(e&&c!==null)b.contentWrapper.show(c.animated,c.options,c.duration,function(e){b.uiDialog.css("height",b._toggleHeight);a.isFunction(c.callback)&&c.callback(e);d.resizable&&b._enableDisableResizer(false)});else{b.contentWrapper.show();d.resizable&&b._enableDisableResizer(false);b.uiDialog.css("height",b.toggleHeight)}},_collapseDialogContent:function(d){var a=this,c=a.options,b=c.collapsingAnimation;c.resizable&&a._enableDisableResizer(true);a._toggleHeight=a.uiDialog[0].style.height;a.uiDialog.height("auto");if(d&&b!==null)a.contentWrapper.hide(b.animated,b.options,b.duration);else a.contentWrapper.hide();a._enableDisableDragger(a.isPin)},_enableDisableResizer:function(a){var b=this.uiDialog;b.resizable({disabled:a});a&&b.removeClass("ui-state-disabled")},_enableDisableDragger:function(a){var b=this.uiDialog;b.draggable({disabled:a});a&&b.removeClass("ui-state-disabled")},minimize:function(){var b=this,k=b.uiDialog,q=b.options,f=null,h=a("<div></div>"),j=a("<div></div>"),e,n,p,l,g={},o,i={},d="uiDialog",m;if(!b.minimized){l=b.uiDialog.position();g.width=b.uiDialog.width();g.height=b.uiDialog.height();m=b.getState();if(b.maximized){b.maximized=false;b.restoreButton.remove();a(window).unbind(".onWinResize")}else{b.collapsed&&b._expandDialogContent(false);b._saveNormalState()}b._enableDisableResizer(true);b.collapsed&&b._collapseDialogContent(false);h.appendTo(document.body).css({top:b.uiDialog.offset().top,left:b.uiDialog.offset().left,height:b.uiDialog.innerHeight(),width:b.uiDialog.innerWidth(),position:"absolute"});b.contentWrapper.hide();b.uiDialogButtonPane.length&&b.uiDialogButtonPane.hide();k.height("auto");k.width("auto");b._doButtonAction(b.minimizeButton,"hide");b._restoreButton(true,b.minimizeButton,"After");b._doButtonAction(b.pinButton,"hide");b._doButtonAction(b.refreshButton,"hide");b._doButtonAction(b.toggleButton,"hide");b._doButtonAction(b.maximizeButton,"show");a.browser.webkit&&a(".wijmo-wijdialog-captionbutton",b.uiDialog).css("float","left");if(b.innerFrame){d="copy";b[d]=b.uiDialog.clone();b[d].empty();b.uiDialogTitlebar.appendTo(b[d])}if(q.minimizeZoneElementId.length>0)f=a("#"+q.minimizeZoneElementId);if(f!==null&&f.size()>0)f.append(b[d]);else{e=a("."+c);if(e.size()===0){e=a('<div class="'+c+'"></div>');a(document.body).append(e)}e.append(b[d]).css("z-index",k.css("z-index"))}b[d].css("position","static");b[d].css("float","left");if(a.browser.msie&&a.browser.version==="6.0"){n=a(document).scrollTop();p=document.documentElement.clientHeight-e.height()+n;e.css({position:"absolute",left:"0px",top:p})}j.appendTo(document.body).css({top:b[d].offset().top,left:b[d].offset().left,height:b[d].innerHeight(),width:b[d].innerWidth(),position:"absolute"});b.uiDialog.hide();b.innerFrame&&b[d].hide();h.effect("transfer",{to:j,className:"ui-widget-content"},100,function(){h.remove();j.remove();b[d].show();b.minimized=true;o=b.uiDialog.position();i.width=b.uiDialog.width();i.height=b.uiDialog.height();b._enableDisableDragger(true);b._trigger("resize",null,{originalPosition:l,originalSize:g,position:o,size:i});b._trigger("stateChanged",null,{originalState:m,state:"minimized"})})}},_doButtonAction:function(a,c){if(a!==undefined){a.removeClass(b);a[c]()}},maximize:function(){var b=this,h=a(window),e,c={},f,d={},g;if(!b.maximized){b._enableDisableDragger(false);e=b.uiDialog.position();c.width=b.uiDialog.width();c.height=b.uiDialog.height();if(b.minimized)b.restore();else{b.collapsed&&b._expandDialogContent(false);b._saveNormalState();g="normal"}b.maximized=true;if(b.maximizeButton!==undefined){b.maximizeButton.hide();b._restoreButton(true,b.maximizeButton,"Before")}a.browser.webkit&&a(".wijmo-wijdialog-captionbutton").css("float","");b._onWinResize(b,h);b.collapsed&&b._collapseDialogContent(false);!b.collapsed&&b._enableDisableDragger(true);b.uiDialog.resizable({disabled:true});b.uiDialog.removeClass("ui-state-disabled");f=b.uiDialog.position();d.width=b.uiDialog.width();d.height=b.uiDialog.height();b._trigger("resize",null,{originalPosition:e,originalSize:c,position:f,size:d});g==="normal"&&b._trigger("stateChanged",null,{originalState:"normal",state:"maximized"})}},_bindWindowResize:function(){var b=this,d=a(window),f,e,c;d.resize(function(){b.maximized&&b._onWinResize(b,d)});a.browser.msie&&a.browser.version==="6.0"&&d.bind("scroll.wijdialog resize.wijdialog",function(){if(b.minimized){e=a(document).scrollTop();c=b.uiDialog.parent();f=document.documentElement.clientHeight-c.height()+e;c.css({top:f})}})},_saveNormalState:function(){var a=this,b=a.uiDialog,c=a.element;if(!a.maximized){a.normalWidth=b.css("width");a.normalLeft=b.css("left");a.normalTop=b.css("top");a.normalHeight=b.css("height");a.normalInnerHeight=c.css("height");a.normalInnerWidth=c.css("width");a.normalInnerMinWidth=c.css("min-width");a.normalInnerMinHeight=c.css("min-height")}},_onWinResize:function(a,b){a.uiDialog.css("top",b.scrollTop());a.uiDialog.css("left",b.scrollLeft());a.uiDialog.setOutWidth(b.width());a.uiDialog.setOutHeight(b.height());a.options.width=a.uiDialog.width();a.options.height=a.uiDialog.height();a._size();if(a.collapsed){a.uiDialog.height("auto");a.contentWrapper.hide()}},_restoreButton:function(c,f,e){var a=this,d={button:"restore",info:{visible:c,click:a.restore,iconClassOn:"ui-icon-newwin"}},b=a._createCaptionButton(d,a.uiDialogTitlebar,true);if(c){b["insert"+e](f);a.restoreButton=b}},_appendToBody:function(a){if(!this.innerFrame)a.appendTo(document.body);else{this.uiDialogTitlebar.prependTo(a);a.show()}},restore:function(){var b=this,k=b.uiDialog,f,d={},g,e={},i=a("<div></div>"),j=a("<div></div>"),c="uiDialog",h;if(b.minimized){b.minimized=false;b._enableDisableDragger(false);if(b.innerFrame){c="copy";if(!b[c])c="uiDialog"}f=b[c].position();d.width=b[c].width();d.height=b[c].height();i.appendTo(document.body).css({top:b[c].offset().top,left:b[c].offset().left,height:b[c].innerHeight(),width:b[c].innerWidth(),position:"absolute"});k.css("position","absolute");k.css("float","");b._appendToBody(k);b._enableDisableResizer(false);!b.isPin&&b._enableDisableDragger(false);b._restoreToNormal();b.contentWrapper.show();b.uiDialogButtonPane.length&&b.uiDialogButtonPane.show();j.appendTo(document.body).css({top:b.uiDialog.offset().top,left:b.uiDialog.offset().left,height:b.uiDialog.innerHeight(),width:b.uiDialog.innerWidth(),position:"absolute"});b.uiDialog.hide();i.effect("transfer",{to:j,className:"ui-widget-content"},150,function(){b.uiDialog.show();g=b.uiDialog.position();e.width=b.uiDialog.width();e.height=b.uiDialog.height();i.remove();j.remove();b.copy&&b.copy.remove();b._trigger("resize",null,{originalPosition:f,originalSize:d,position:g,size:e});h=b.getState();b._trigger("stateChanged",null,{originalState:"minimized",state:h})});b.collapsed&&b._collapseDialogContent();b._doButtonAction(b.minimizeButton,"show");b._doButtonAction(b.restoreButton,"remove");b._doButtonAction(b.pinButton,"show");b._doButtonAction(b.refreshButton,"show");b._doButtonAction(b.toggleButton,"show");a.browser.webkit&&a(".wijmo-wijdialog-captionbutton").css("float","")}else if(b.maximized){b.maximized=false;f=b.uiDialog.position();d.width=b.uiDialog.width();d.height=b.uiDialog.height();a(window).unbind(".onWinResize");b.collapsed&&b._expandDialogContent();b._enableDisableResizer(false);!b.isPin&&b._enableDisableDragger(false);b._restoreToNormal();b.contentWrapper.show();b.collapsed&&b._collapseDialogContent();if(b.maximizeButton!==undefined){b.maximizeButton.show();b._restoreButton(false,b.maximizeButton,"before")}g=b.uiDialog.position();e.width=b.uiDialog.width();e.height=b.uiDialog.height();b._trigger("resize",null,{originalPosition:f,originalSize:d,position:g,size:e});h=b.getState();b._trigger("stateChanged",null,{originalState:"maximized",state:h})}},getState:function(){var a=this;return a.minimized?"minimized":a.maximized?"maximized":"normal"},reset:function(){var a=this;a.normalWidth=a.normalLeft=a.normalTop=a.normalHeight=a.normalInnerHeight=a.normalInnerWidth=a.normalInnerMinWidth=a.normalInnerMinHeight=undefined;a._setOption("position",a.originalPosition)},open:function(){var b=this,c=b.options;(c.hide==="drop"||c.hide==="bounce")&&a.browser.msie&&b.uiDialog.css("filter","auto");if(!b.innerFrame){if(!b.minimized)a.ui.dialog.prototype.open.apply(b,arguments);else b.uiDialog.show();b.uiDialog.wijTriggerVisibility()}else{b.innerFrame.attr("src",c.contentUrl);if(!b.minimized)a.ui.dialog.prototype.open.apply(b,arguments);else b.uiDialogTitlebar.show()}b.collapsed&&b._collapseDialogContent();if(c.disabled)if(b.disabledDiv)b.disabledDiv.show();else b.disable()},close:function(){var b=this,c=b.options;if(a.ui.dialog.prototype.close.apply(b,arguments)){if(b.innerFrame){b.innerFrame.attr("src","");b.minimized&&b.uiDialogTitlebar.hide()}b.disabledDiv&&c.disabled&&b.disabledDiv.hide()}},_restoreToNormal:function(){var a=this,b=a.uiDialog,c=a.element;b.css("width",a.normalWidth);b.css("left",a.normalLeft);b.css("top",a.normalTop);b.css("height",a.normalHeight);c.css("height",a.normalInnerHeight);c.css("width",a.normalInnerWidth);c.css("min-width",a.normalInnerMinWidth);c.css("min-height",a.normalInnerMinHeight);a.options.width=a.uiDialog.width();a.options.height=a.uiDialog.height()}});a.extend(a.ui.dialog.overlay,{create:function(b){a.ui.dialog.latestDlg=b;if(this.instances.length===0){setTimeout(function(){a.ui.dialog.overlay.instances.length&&a(document).bind(a.ui.dialog.overlay.events,function(b){if(a(b.target).zIndex()<a.ui.dialog.overlay.maxZ&&!a.contains(a.ui.dialog.latestDlg.element[0],b.target))return false})},1);a(document).bind("keydown.dialog-overlay",function(c){if(b.options.closeOnEscape&&!c.isDefaultPrevented()&&c.keyCode&&c.keyCode===a.ui.keyCode.ESCAPE){b.close(c);c.preventDefault()}});a(window).bind("resize.dialog-overlay",a.ui.dialog.overlay.resize)}var c=(this.oldInstances.pop()||a("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});a.fn.bgiframe&&c.bgiframe();this.instances.push(c);return c},height:function(){var b,c;if(a.browser.msie){b=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);c=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return b<c?a(window).height()+"px":b+"px"}else return a(document).height()+"px"},width:function(){var b,c;if(a.browser.msie){b=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);c=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return b<c?a(window).width()+"px":b+"px"}else return a(document).width()+"px"}})})(jQuery);
(function(a){"use strict";a.widget("wijmo.wijaccordion",{options:{animated:"slide",duration:null,event:"click",disabled:false,expandDirection:"bottom",header:"> li > :first-child,> :not(li):even",requireOpenedPane:true,selectedIndex:0},_setOption:function(d,b){var c=this.options;if(c[d]!==b)switch(d){case"selectedIndex":this.activate(b);break;case"disabled":if(b)this.element.addClass("ui-state-disabled");else this.element.removeClass("ui-state-disabled");break;case"event":this._unbindLiveEvents();this.options.event=b;this._bindLiveEvents();break;case"header":this._handleHeaderChange(b,c.header);break;case"expandDirection":this._onDirectionChange(b,true,c.expandDirection)}a.Widget.prototype._setOption.apply(this,arguments)},_handleHeaderChange:function(b,a){var c=this.element.find(a);c.removeClass("ui-accordion-header ui-helper-reset ui-state-active "+this._triangleIconOpened).siblings(".ui-accordion-content").removeClass("ui-accordion-content ui-helper-reset ui-widget-content ui-accordion-content-active");this._initHeaders(b)},_initHeaders:function(a){var b=this.options;a=a?a:b.header;this.headers=this.element.find(a);this.headers.each(jQuery.proxy(this._initHeader,this))},_initHeader:function(e,f){var g=this.options,d=this.element.data("rightToLeft"),b=a(f),c=a(b.next()[0]);if(d){b.remove();b.insertAfter(c)}b.addClass("ui-accordion-header ui-helper-reset").attr("role","tab");c.attr("role","tabpanel");b.find("> a").length===0&&b.wrapInner('<a href="#"></a>');b.find("> .ui-icon").length===0&&a('<span class="ui-icon"></span>').insertBefore(a("> a",b)[0]);if(e===g.selectedIndex){b.addClass("ui-state-active").addClass(this._headerCornerOpened).attr({"aria-expanded":"true",tabIndex:0}).find("> .ui-icon").addClass(this._triangleIconOpened);c.addClass("ui-accordion-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility()}else{b.addClass("ui-state-default ui-corner-all").attr({"aria-expanded":"false",tabIndex:-1}).find("> .ui-icon").addClass(this._triangleIconClosed);c.hide()}c.addClass("ui-accordion-content ui-helper-reset ui-widget-content")},_create:function(){if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);this.element.addClass("wijmo-wijaccordion ui-accordion ui-widget ui-accordion-icons ui-helper-reset ui-helper-clearfix");var b=this.options;b.disabled&&this.element.addClass("ui-state-disabled");this._onDirectionChange(b.expandDirection,false);this._initHeaders();this.element.attr("role","tablist")},_init:function(){this._bindLiveEvents()},destroy:function(){this._unbindLiveEvents();this.element.removeClass("wijmo-wijaccordion ui-accordion ui-widget ui-helper-reset ui-accordion-icons").removeAttr("role");a.Widget.prototype.destroy.apply(this,arguments)},activate:function(f){var b,c=this.options,n=this.element.children(".ui-accordion-header"),d=this.element.find(".ui-accordion-header.ui-state-active"),p=this.element.data("rightToLeft"),i,k,g,h,l,o,m,j,q,e;if(typeof f==="number")b=a(n[f]);else if(typeof f==="string"){f=parseInt(f,0);b=a(n[f])}else{b=a(f);f=n.index(f)}if(b.hasClass("ui-state-active"))if(c.requireOpenedPane){if(d.length===b.length&&d.index()===b.index())return false}else{d=b;b=a(null)}else if(!c.requireOpenedPane)d=a(null);i=a(".ui-accordion-header",this.element).index(b);k=a(".ui-accordion-header",this.element).index(d);g=p?b.prev(".ui-accordion-content"):b.next(".ui-accordion-content");h=p?d.prev(".ui-accordion-content"):d.next(".ui-accordion-content");if(d.length===0&&b.length===0)return false;if(!this._trigger("beforeSelectedIndexChanged",null,{newIndex:i,prevIndex:k}))return false;d.removeClass("ui-state-active").removeClass(this._headerCornerOpened).addClass("ui-state-default ui-corner-all").attr({"aria-expanded":"false",tabIndex:-1}).find("> .ui-icon").removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);b.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active").addClass(this._headerCornerOpened).attr({"aria-expanded":"true",tabIndex:0}).find("> .ui-icon").removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);if(c.animated){l={toShow:g,toHide:h,complete:jQuery.proxy(function(){h.removeClass("ui-accordion-content-active");g.addClass("ui-accordion-content-active").wijTriggerVisibility();h.css("display","");g.css("display","");if(a.fn.wijlinechart){h.find(".wijmo-wijlinechart").wijlinechart("redraw");g.find(".wijmo-wijlinechart").wijlinechart("redraw")}this._trigger("selectedIndexChanged",null,{newIndex:i,prevIndex:k})},this),horizontal:this.element.hasClass("ui-helper-horizontal"),rightToLeft:this.element.data("rightToLeft"),down:i>k,autoHeight:c.autoHeight||c.fillSpace};o=c.animated;m=c.duration;if(a.isFunction(o))c.animated=o(l);if(a.isFunction(m))c.duration=m(l);j=a.wijmo.wijaccordion.animations;q=c.duration;e=c.animated;if(e&&!j[e]&&!a.easing[e])e="slide";if(!j[e])j[e]=function(a){this.slide(a,{easing:e,duration:q||700})};j[e](l)}else{d.length>0&&h.hide().removeClass("ui-accordion-content-active");b.length>0&&g.show().addClass("ui-accordion-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();if(a.fn.wijlinechart){h.find(".wijmo-wijlinechart").wijlinechart("redraw");g.find(".wijmo-wijlinechart").wijlinechart("redraw")}this._trigger("selectedIndexChanged",null,{newIndex:i,prevIndex:k})}this.options.selectedIndex=i},_bindLiveEvents:function(){this.element.find(".ui-accordion-header").live(this.options.event+".wijaccordion",jQuery.proxy(this._onHeaderClick,this)).live("keydown.wijaccordion",jQuery.proxy(this._onHeaderKeyDown,this)).live("mouseenter.wijaccordion",function(){a(this).addClass("ui-state-hover")}).live("mouseleave.wijaccordion",function(){a(this).removeClass("ui-state-hover")}).live("focus.wijaccordion",function(){a(this).addClass("ui-state-focus")}).live("blur.wijaccordion",function(){a(this).removeClass("ui-state-focus")})},_unbindLiveEvents:function(){this.element.find(".ui-accordion-header").die(".wijaccordion")},_onHeaderClick:function(a){!this.options.disabled&&this.activate(a.currentTarget);return false},_onHeaderKeyDown:function(d){if(this.options.disabled||d.altKey||d.ctrlKey)return;var b=a.ui.keyCode,f=this.element.find(".ui-accordion-header.ui-state-focus"),c,e=this.element.find(".ui-accordion-header");if(f.length>0){c=a(".ui-accordion-header",this.element).index(f);switch(d.keyCode){case b.RIGHT:case b.DOWN:if(e[c+1]){e[c+1].focus();return false}break;case b.LEFT:case b.UP:if(e[c-1]){e[c-1].focus();return false}break;case b.SPACE:case b.ENTER:this.activate(d.currentTarget);d.preventDefault()}}return true},_onDirectionChange:function(j,e,i){var b,g,f,d,c,h;if(e){g=this.element.find(".ui-accordion-header."+this._headerCornerOpened);g.removeClass(this._headerCornerOpened);f=this.element.find(".ui-accordion-content."+this._contentCornerOpened);f.removeClass(this._contentCornerOpened);d=this.element.find("."+this._triangleIconOpened);c=this.element.find("."+this._triangleIconClosed);d.removeClass(this._triangleIconOpened);c.removeClass(this._triangleIconClosed)}i!==null&&this.element.removeClass("ui-accordion-"+i);switch(j){case"top":this._headerCornerOpened="ui-corner-bottom";this._contentCornerOpened="ui-corner-top";this._triangleIconOpened="ui-icon-triangle-1-n";this._triangleIconClosed="ui-icon-triangle-1-e";b=true;this.element.removeClass("ui-helper-horizontal");this.element.addClass("ui-accordion-top");break;case"right":this._headerCornerOpened="ui-corner-left";this._contentCornerOpened="ui-corner-right";this._triangleIconOpened="ui-icon-triangle-1-e";this._triangleIconClosed="ui-icon-triangle-1-s";b=false;this.element.addClass("ui-helper-horizontal");this.element.addClass("ui-accordion-right");break;case"left":this._headerCornerOpened="ui-corner-right";this._contentCornerOpened="ui-corner-left";this._triangleIconOpened="ui-icon-triangle-1-w";this._triangleIconClosed="ui-icon-triangle-1-s";b=true;this.element.addClass("ui-helper-horizontal");this.element.addClass("ui-accordion-left");break;default:this._headerCornerOpened="ui-corner-top";this._contentCornerOpened="ui-corner-bottom";this._triangleIconOpened="ui-icon-triangle-1-s";this._triangleIconClosed="ui-icon-triangle-1-e";b=false;this.element.removeClass("ui-helper-horizontal");this.element.addClass("ui-accordion-bottom")}h=this.element.data("rightToLeft");this.element.data("rightToLeft",b);if(e){d.addClass(this._triangleIconOpened);c.addClass(this._triangleIconClosed);g.addClass(this._headerCornerOpened);f.addClass(this._contentCornerOpened)}e&&b!==h&&this.element.children(".ui-accordion-header").each(function(){var c=a(this),d;if(b){d=c.next(".ui-accordion-content");c.remove();c.insertAfter(d)}else{d=c.prev(".ui-accordion-content");c.remove();c.insertBefore(d)}})}});a.extend(a.wijmo.wijaccordion,{animations:{slide:function(b,h){b=a.extend({easing:"swing",duration:300},b,h);if(!b.toHide.size()){b.toShow.stop(true,true).animate(b.horizontal?{width:"show"}:{height:"show"},b);return}if(!b.toShow.size()){b.toHide.stop(true,true).animate(b.horizontal?{width:"hide"}:{height:"hide"},b);return}var i=b.toShow.css("overflow"),f=0,e={},g={},j=b.horizontal?["width","paddingLeft","paddingRight"]:["height","paddingTop","paddingBottom"],d,c=b.toShow;if(b.horizontal){d=c[0].style.height;c.height(parseInt(c.parent().height(),10)-parseInt(c.css("paddingTop"),10)-parseInt(c.css("paddingBottom"),10)-(parseInt(c.css("borderTopWidth"),10)||0)-(parseInt(c.css("borderBottomWidth"),10)||0))}else{d=c[0].style.width;c.width(parseInt(c.parent().width(),10)-parseInt(c.css("paddingLeft"),10)-parseInt(c.css("paddingRight"),10)-(parseInt(c.css("borderLeftWidth"),10)||0)-(parseInt(c.css("borderRightWidth"),10)||0))}a.each(j,function(f,d){g[d]="hide";var c=(""+a.css(b.toShow[0],d)).match(/^([\d+-.]+)(.*)$/);e[d]={value:c?c[1]:0,unit:c?c[2]||"px":"px"}});b.toShow.css(b.horizontal?{width:0,overflow:"hidden"}:{height:0,overflow:"hidden"}).stop(true,true).show();b.toHide.filter(":hidden").each(b.complete).end().filter(":visible").stop(true,true).animate(g,{step:function(d,a){var c;if(a.prop===b.horizontal?"width":"height")f=a.end-a.start===0?0:(a.now-a.start)/(a.end-a.start);c=f*e[a.prop].value;if(c<0)c=0;b.toShow[0].style[a.prop]=c+e[a.prop].unit},duration:b.duration,easing:b.easing,complete:function(){!b.autoHeight&&b.toShow.css(b.horizontal?"width":"height","");b.toShow.css(b.horizontal?"height":"width",d);b.toShow.css({overflow:i});b.complete()}})},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1e3:200})}}})})(jQuery);
(function(a){"use strict";a.fn.extend({getBounds:function(){return a.extend({},a(this).offset(),{width:a(this).outerWidth(true),height:a(this).outerHeight(true)})},setBounds:function(b){a(this).css({left:b.left,top:b.top}).width(b.width).height(b.height);return this},getMaxZIndex:function(){var b=(a(this).css("z-index")=="auto"?0:a(this).css("z-index"))*1;a(this).siblings().each(function(d,c){b=Math.max(b,(a(c).css("z-index")=="auto"?0:a(c).css("z-index"))*1)});return b}});a.widget("wijmo.wijpopup",{options:{ensureOutermost:false,showEffect:"show",showOptions:{},showDuration:300,hideEffect:"hide",hideOptions:{},hideDuration:100,autoHide:false,position:{at:"left bottom",my:"left top"},showing:null,shown:null,hiding:null,hidden:null,posChanged:null},_create:function(){if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a)},_init:function(){if(!!this.options.ensureOutermost){var b=a("form");if(b.length===0)b=a(document.body);this.element.appendTo(b)}this.element.data("visible.wijpopup",false);this.element.css("position","absolute");this.element.position({of:a(document.body)});this.element.hide()},_setOption:function(c){a.Widget.prototype._setOption.apply(this,arguments);if(c==="autoHide"){var b=this.isVisible();this.hide();b&&this.show()}},destroy:function(){a.Widget.prototype.destroy.apply(this,arguments);this.isVisible()&&this.hide();if(a.browser.msie&&a.browser.version<7){jFrame=this.element.data("backframe.wijpopup");!jFrame&&jFrame.remove()}var b=this;this.element.unbind(".wijpopup");a.each(["visible","backframe","animating","width"],function(c,a){b.element.removeData(a+".wijpopup")})},isVisible:function(){return!!this.element.data("visible.wijpopup")&&this.element.is(":visible")},isAnimating:function(){return!!this.element.data("animating.wijpopup")},_pushQueue:function(){var c=a(window),b=c.data("wijPopupQueue"),d;if(!b){b=[];c.data("wijPopupQueue",b)}return b.push(this)},show:function(d){this._setPosition(d);if(this.isVisible())return;if(this._trigger("showing")===false)return;var e=this;if(this.options.autoHide)this._pushQueue()===1&&a(document).bind("mouseup.wijpopup",function(a){e._onDocMouseUp(a)});var b=this.options.showEffect||"show",c=this.options.showDuration||300,f=this.options.showOptions||{};this.element.data("animating.wijpopup",true);if(a.effects&&a.effects[b])this.element.show(b,f,c,a.proxy(this._showCompleted,this));else this.element[b](b==="show"?null:c,a.proxy(this._showCompleted,this));(!b||!c||b==="show"||c<=0)&&this._showCompleted()},_showCompleted:function(){this.element.removeData("animating.wijpopup");this.element.data("visible.wijpopup",true);this._trigger("shown")},showAt:function(a,b){this.show({my:"left top",at:"left top",of:document.body,offset:""+a+" "+b})},hide:function(){if(!this.isVisible())return;if(this._trigger("hiding")===false)return;var b=this.options.hideEffect||"hide",c=this.options.hideDuration||300,d=this.options.hideOptions||{};this.element.data("animating.wijpopup",true);if(a.effects&&a.effects[b])this.element.hide(b,d,c,a.proxy(this._hideCompleted,this));else this.element[b](b==="hide"?null:c,a.proxy(this._hideCompleted,this));(!b||!c||b==="hide"||c<=0)&&this._hideCompleted()},_hideCompleted:function(){if(this.element.data("width.wijpopup")!==undefined){this.element.width(this.element.data("width.wijpopup"));this.element.removeData("width.wijpopup")}this.element.removeData("animating.wijpopup").unbind("move.wijpopup");if(a.browser.msie&&a.browser.version<7){var b=this.element.data("backframe.wijpopup");b&&b.hide()}this._trigger("hidden")},_onDocMouseUp:function(e){var f=a(window),c=a(e.target?e.target:e.srcElement),d=f.data("wijPopupQueue"),b;if(c.parents().hasClass("wijmo-wijcombobox-list")||c.parents().hasClass("wijmo-wijcalendar"))return;if(!!d){while(b=d.pop())if(b.isVisible()){if(!!b.options.autoHide){if(c.get(0)!=b.element.get(0)&&c.parents().index(b.element)<0)b.hide();else d.push(b);break}}else break;d.length===0&&a(document).unbind("mouseup.wijpopup")}},_onMove:function(){var a=this.element.data("backframe.wijpopup");if(a){this.element.before(a);a.css({top:this.element.css("top"),left:this.element.css("left")})}},_addBackgroundIFrame:function(){if(a.browser.msie&&a.browser.version<7){var b=this.element.data("backframe.wijpopup");if(!b){b=jQuery("<iframe/>").css({position:"absolute",display:"none",filter:"progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)"}).attr({src:"javascript:'<html></html>';",scrolling:"no",frameborder:"0","tabIndex ":-1});this.element.before(b);this.element.data("backframe.wijpopup",b);this.element.bind("move.wijpopup",a.proxy(this._onMove,this))}b.setBounds(this.element.getBounds());b.css({display:"block",left:this.element.css("left"),top:this.element.css("top"),"z-index":this.element.css("z-index")-1})}},_setZIndex:function(b){this.element.css("z-index",b);var a=this.element.data("backframe.wijpopup");a&&a.css("z-index",this.element.css("z-index")-1)},_setPosition:function(c){var d=this.element.is(":visible");this.element.show();this.element.position(a.extend({},this.options.position,c?c:{}));!d&&this.element.hide();this._addBackgroundIFrame();var b=1e3;if(this.options.position.of)b=Math.max(b,a(this.options.position.of).getMaxZIndex());this._setZIndex(b+10);this._trigger("posChanged")}})})(jQuery);
(function(a){"use strict";var i="wijmo-wijsuperpanel ui-widget ui-widget-content",h="ui-corner-all",b="ui-state-disabled",f="ui-state-hover",g="ui-state-active",e="ui-state-default",c="wijmo-wijsuperpanel-handle",d="wijmo-wijsuperpanel-hbarcontainer",j="wijmo-wijsuperpanel-vbarcontainer",l="<div class='wijmo-wijsuperpanel-statecontainer'><div class='wijmo-wijsuperpanel-contentwrapper'><div class='wijmo-wijsuperpanel-templateouterwrapper'></div></div></div>",k="<div class='wijmo-wijsuperpanel-hbarcontainer ui-widget-header'><div class='wijmo-wijsuperpanel-handle ui-state-default ui-corner-all'><span class='ui-icon ui-icon-grip-solid-vertical'></span></div><div class='wijmo-wijsuperpanel-hbar-buttonleft ui-state-default ui-corner-bl'><span class='ui-icon ui-icon-triangle-1-w'></span></div><div class='wijmo-wijsuperpanel-hbar-buttonright ui-state-default ui-corner-br'><span class='ui-icon ui-icon-triangle-1-e'></span></div></div>",n="<div class='wijmo-wijsuperpanel-vbarcontainer ui-widget-header'><div class='wijmo-wijsuperpanel-handle ui-state-default ui-corner-all'><span class='ui-icon ui-icon-grip-solid-horizontal'></span></div><div class='wijmo-wijsuperpanel-vbar-buttontop ui-state-default ui-corner-tr'><span class='ui-icon ui-icon-triangle-1-n'></span></div><div class='wijmo-wijsuperpanel-vbar-buttonbottom ui-state-default ui-corner-br'><span class='ui-icon ui-icon-triangle-1-s'></span></div></div>",m="<div class='ui-state-default wijmo-wijsuperpanel-button wijmo-wijsuperpanel-buttonleft'><span class='ui-icon ui-icon-carat-1-w'></span></div><div class='ui-state-default wijmo-wijsuperpanel-button wijmo-wijsuperpanel-buttonright'><span class='ui-icon ui-icon-carat-1-e'></span></div>",o="<div class='ui-state-default wijmo-wijsuperpanel-button wijmo-wijsuperpanel-buttontop'><span class='ui-icon ui-icon-carat-1-n'></span></div><div class='ui-state-default wijmo-wijsuperpanel-button wijmo-wijsuperpanel-buttonbottom'><span class='ui-icon ui-icon-carat-1-s'></span></div>";a.widget("wijmo.wijsuperpanel",{options:{allowResize:false,autoRefresh:false,animationOptions:{queue:false,disabled:false,duration:250,easing:undefined},hScrollerActivating:null,hScroller:{scrollBarPosition:"bottom",scrollBarVisibility:"auto",scrollMode:"scrollBar",scrollValue:null,scrollMax:100,scrollMin:0,scrollLargeChange:null,scrollSmallChange:null,scrollMinDragLength:6,increaseButtonPosition:null,decreaseButtonPosition:null,hoverEdgeSpan:20,firstStepChangeFix:0},keyboardSupport:false,keyDownInterval:100,mouseWheelSupport:true,bubbleScrollingEvent:true,resizableOptions:{handles:"all",helper:"ui-widget-content wijmo-wijsuperpanel-helper"},resized:null,dragStop:null,painted:null,scrolling:null,scroll:null,scrolled:null,showRounder:true,vScrollerActivating:null,vScroller:{scrollBarPosition:"right",scrollBarVisibility:"auto",scrollMode:"scrollBar",scrollValue:null,scrollMax:100,scrollMin:0,scrollLargeChange:null,scrollSmallChange:null,scrollMinDragLength:6,increaseButtonPosition:null,decreaseButtonPosition:null,hoverEdgeSpan:20,firstStepChangeFix:0},customScrolling:false,listenContentScroll:false},_setOption:function(d,b){var c=this,h=c.options,g=c._fields(),e=g.hbarDrag,f=g.vbarDrag,i=g.resizer;if(d==="animationOptions")b=a.extend(h.animationOptions,b);else if(d==="hScroller"){if(b.scrollLargeChange!==undefined&&b.scrollLargeChange!==null)c._autoHLarge=false;b=a.extend(h.hScroller,b)}else if(d==="vScroller"){if(b.scrollLargeChange!==undefined&&b.scrollLargeChange!==null)c._autoVLarge=false;b=a.extend(h.vScroller,b)}else if(d==="resizableOptions")b=a.extend(c.resizableOptions,b);a.Widget.prototype._setOption.apply(c,arguments);if(a.isPlainObject(b))c.options[d]=b;switch(d){case"allowResize":c._initResizer();break;case"disabled":if(b){e!==undefined&&e.draggable("disable");f!==undefined&&f.draggable("disable");i!==undefined&&i.resizable("disable")}else{e!==undefined&&e.draggable("enable");f!==undefined&&f.draggable("enable");i!==undefined&&i.resizable("enable")}break;case"mouseWheelSupport":case"keyboardSupport":c._bindElementEvents(c,g,c.element,h)}return c},_create:function(){var b=this,c=b.options;c.vScroller.dir="v";c.hScroller.dir="h";if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);b.paintPanel();b._initResizer();b.options.disabled&&b.disable();b._detectAutoRefresh();c.listenContentScroll&&b._listenContentScroll();b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b.refresh();b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijsuperpanel")},_detectAutoRefresh:function(){var c=this,b=a.wijmo.wijsuperpanel.panels;if(b===undefined){b=[];a.wijmo.wijsuperpanel.panels=b}b.push(c);if(c.options.autoRefresh)if(!a.wijmo.wijsuperpanel.setAutoRefreshInterval){a.wijmo.wijsuperpanel.setAutoRefreshInterval=c._setAutoRefreshInterval;a.wijmo.wijsuperpanel.setAutoRefreshInterval()}},_setAutoRefreshInterval:function(){var b=a.wijmo.wijsuperpanel.autoRereshInterval,c=a.wijmo.wijsuperpanel.panels,d=window.setInterval(function(){window.clearInterval(d);for(var k=c.length,j=false,b,g,i,f,e,h=0;h<k;h++){b=c[h];g=b.element[0];i=b.options.autoRefresh;if(i)j=true;f=b.getContentElement();e=b._paintedMark;b.options.autoRefresh&&f.is(":visible")&&(e===undefined||e.width!==f[0].offsetWidth||e.height!==f[0].offsetHeight||e.mainWidth!==g.offsetWidth||e.mainHeight!==g.offsetHeight)&&b.paintPanel()}j&&window.setTimeout(a.wijmo.wijsuperpanel.setAutoRefreshInterval,0)},b===undefined?500:b)},destroy:function(){var c=this,b=c._fields(),d=c.element,f,e;a.wijmo.wijsuperpanel.panels=a.grep(a.wijmo.wijsuperpanel.panels,function(a){return a!==c});if(!b.initialized)return;c._radiusKey&&c.element.css(c._radiusKey,"");if(b.intervalID!==undefined){window.clearInterval(b.intervalID);b.intervalID=undefined}b.resizer!==undefined&&b.resizer.resizable("destroy");if(b.hbarContainer!==undefined){b.hbarDrag.remove();b.hbarContainer.unbind("."+c.widgetName)}if(b.vbarContainer!==undefined){b.vbarDrag.remove();b.vbarContainer.unbind("."+c.widgetName)}d.unbind("."+c.widgetName);b.contentWrapper.unbind("."+c.widgetName);f=b.stateContainer.find(">.wijmo-wijsuperpanel-button");f.unbind("."+c.widgetName);e=b.templateWrapper;e.contents().each(function(b,a){d.append(a)});b.stateContainer.remove();b.tabindex&&d.removeAttr("tabindex");d.removeClass(i+" "+h);a.Widget.prototype.destroy.apply(c,arguments)},_fields:function(){var b=this,c=b.element,d=b.widgetName+"-fields",a=b._fieldsStore;if(a===undefined){a={};c.data(d,a);b._fieldsStore=a}return a},_hasMode:function(c,d){var b=c.scrollMode.split(",");b=a.map(b,function(b){return a.trim(b).toLowerCase()});return a.inArray(d.toLowerCase(),b)>-1},_bindElementEvents:function(a,g,b,d){var e=a._hasMode(d.hScroller,"edge"),f=a._hasMode(d.vScroller,"edge"),c=a.widgetName;if(e||f){if(a._mousemoveBind===undefined){a._mousemoveBind=true;b.bind("mousemove."+c,a,a._contentMouseMove);b.bind("mouseleave."+c,null,function(){a._clearInterval()})}}else{b.unbind("mousemove",a._contentMouseMove);a._mousemoveBind=undefined}if(d.mouseWheelSupport){if(a._mouseWheelBind===undefined){a._mouseWheelBind=true;b.bind("mousewheel."+c,a,a._panelMouseWheel)}}else{a.element.unbind("mousewheel",a._panelMouseWheel);a._mouseWheelBind=undefined}if(d.keyboardSupport){if(a._keyboardBind===undefined){a._keyboardBind=true;b.bind("keydown."+c,a,a._panelKeyDown)}}else{b.unbind("keydown",a._panelKeyDown);a._keyboardBind=undefined}},_dragStop:function(d,b,c){var a={dragHandle:c};b._trigger("dragStop",d,a)},_contentMouseMove:function(g){var b=g.data,n=b.options,i,j,f,s,q,r,h,m,d,e,k,l,o,p,c;if(n.disabled)return;i=n.hScroller;j=n.vScroller;f=a(g.currentTarget);s=b._fields();q=b._hasMode(i,"edge");r=b._hasMode(j,"edge");b._clearInterval();h={X:g.pageX,Y:g.pageY};m=f.offset();d=m.left;e=m.top;d=h.X-d;e=h.Y-e;k=i.hoverEdgeSpan;l=j.hoverEdgeSpan;o=f.innerHeight();p=f.innerWidth();c="";if(q){if(d<k)c="left";if(d>p-k)c="right"}if(r){if(e<l)c="top";if(e>o-l)c="bottom"}b._setScrollingInterval(s,c,b,false)},_setScrollingInterval:function(d,b,a,c){var e=a.options;if(b.length>0)d.internalFuncID=window.setInterval(function(){a._doScrolling(b,a,c)},e.keyDownInterval)},_scrollButtonMouseOver:function(e){var c=e.data,d;if(c.options.disabled)return;d=a(e.currentTarget);if(!d.hasClass(b)){d.bind("mouseout."+c.widgetName,c,c._buttonMouseOut).bind("mousedown."+c.widgetName,c,c._buttonMouseDown).bind("mouseup."+c.widgetName,c,c._buttonMouseUp).addClass(f);c._buttonScroll(d,c,"buttonshover")}},_buttonScroll:function(c,a,f){var b="",g=a.options,h=a._fields(),d=a._hasMode(g.hScroller,f),e=a._hasMode(g.vScroller,f);if(c.hasClass("wijmo-wijsuperpanel-buttonleft")&&d)b="left";else if(c.hasClass("wijmo-wijsuperpanel-buttonright")&&d)b="right";else if(c.hasClass("wijmo-wijsuperpanel-buttontop")&&e)b="top";else if(c.hasClass("wijmo-wijsuperpanel-buttonbottom")&&e)b="bottom";if(b.length>0){a._clearInterval();a._doScrolling(b,a,true);a._setScrollingInterval(h,b,a,true)}},_listenContentScroll:function(){var b=this,f=b.options,a=b._fields(),h=a.hbarContainer,k=a.hbarDrag,i=a.vbarContainer,l=a.vbarDrag,c=a.templateWrapper,d=a.contentWrapper,n=d.width(),m=d.height(),e=c&&c.offset(),o=e&&e.left,p=e&&e.top,j=a.contentWidth,g=a.contentHeight;d.bind("scroll",function(){var o=c.position(),a=o.left,e=o.top;d.scrollTop(0).scrollLeft(0);c.css({left:a,top:e});if(a<=0&&a>n-j){f.hScroller.scrollValue=b.scrollPxToValue(-a,"h");b._scrollDrag("h",h,k,true)}if(e<=0&&e>m-g){f.vScroller.scrollValue=b.scrollPxToValue(-e,"v");b._scrollDrag("v",i,l,true)}})},_buttonMouseDown:function(e){var d=e.data,c;if(d.options.disabled)return;c=a(e.currentTarget);if(!c.hasClass(b)){c.addClass(g);d._buttonScroll(c,d,"buttons")}},_buttonMouseUp:function(b){var d=b.data,c=a(b.currentTarget);c.removeClass("ui-state-active");d._clearInterval()},_buttonMouseOut:function(c){var b=c.data,d=a(c.currentTarget);d.unbind("mouseout",b._buttonMouseOut).unbind("mousedown",b._buttonMouseDown).unbind("mouseup",b._buttonMouseUp).removeClass(f).removeClass(g);b._clearInterval()},_panelKeyDown:function(e){var b=e.data,f=b.options,d,c;if(!f.keyboardSupport||f.disabled)return;d=e.shiftKey;c=e.keyCode;if(c===a.ui.keyCode.LEFT)b._doScrolling("left",b,d);else if(c===a.ui.keyCode.RIGHT)b._doScrolling("right",b,d);else if(c===a.ui.keyCode.UP)b._doScrolling("top",b,d);else c===a.ui.keyCode.DOWN&&b._doScrolling("bottom",b,d);e.stopPropagation();e.preventDefault()},_draggingInternal:function(n,a,b,k){var d=b.dir,j=d==="h",h=j?"left":"top",o=n.position[h]-a._getScrollContainerPadding(h),m=a._getTrackLen(d)-k[j?"outerWidth":"outerHeight"](true),l=o/m,e=b.scrollMax-b.scrollLargeChange+1,c=l*e,g,f,i;if(c<b.scrollMin)c=b.scrollMin;if(c>e)c=e;g={oldValue:b.scrollValue,newValue:c,dir:d};if(!a._scrolling(true,a,g))return;if(a.customScroll){i=Math.abs(a.customScroll);f=a.scrollPxToValue(i,b.dir)}b.scrollValue=f||c;a.customScroll=undefined;a._setDragAndContentPosition(true,false,d,"dragging")},_dragging:function(g,e,b){var f=b.options,c=a(g.target),h=c.parent();if(h.hasClass(d))b._draggingInternal(e,b,f.hScroller,c);else b._draggingInternal(e,b,f.vScroller,c)},_panelMouseWheel:function(h,l){var c=h.data,i=c.options,k,b,j,f,g,e;if(!i.mouseWheelSupport||i.disabled)return;k=a(h.srcElement||h.originalEvent.target);b="";j=k.closest("."+d,c.element).size()>0;f=i.hScroller;g=i.vScroller;if(l>0)b=j?"left":"top";else b=j?"right":"bottom";b.length>0&&c._doScrolling(b,c);e=false;if(b==="left")e=!c.hNeedScrollBar||Math.abs(f.scrollValue-f.scrollMin)<.001;if(b==="right")e=!c.hNeedScrollBar||Math.abs(f.scrollValue-(f.scrollMax-c._getHScrollBarLargeChange()+1))<.001;if(b==="top")e=!c.vNeedScrollBar||Math.abs(g.scrollValue-g.scrollMin)<.001;if(b==="bottom")e=!c.vNeedScrollBar||Math.abs(g.scrollValue-(g.scrollMax-c._getVScrollBarLargeChange()+1))<.001;if(!e||!i.bubbleScrollingEvent||b==="left"||b==="right"){h.stopPropagation();h.preventDefault()}},_documentMouseUp:function(c){var b=c.data.self,d=c.data.ele;d.removeClass(g);b._clearInterval();a(document).unbind("mouseup",b._documentMouseUp)},_scrollerMouseOver:function(i){var b=i.data,g,c,h;if(b.options.disabled)return;g=a(i.srcElement||i.originalEvent.target);c=null;h=false;if(g.hasClass(e)){c=g;h=true}else if(g.parent().hasClass(e)){c=g.parent();h=true}else if(g.hasClass(j)||g.hasClass(d))c=g;if(c!==undefined){h&&c.addClass(f);c.bind("mouseout."+b.widgetName,b,b._elementMouseOut);c.bind("mousedown."+b.widgetName,b,b._elementMouseDown);c.bind("mouseup."+b.widgetName,b,b._elementMouseUp)}},_elementMouseUp:function(c){var b=a(c.currentTarget);b.removeClass("ui-state-active")},_elementMouseDown:function(i){var b=a(i.currentTarget),f=i.data,e,h,g,k,n,l,m,o;if(f.options.disabled||i.which!==1)return;e="";h=false;g=false;if(b.hasClass("wijmo-wijsuperpanel-vbar-buttontop")){e="top";g=true}else if(b.hasClass("wijmo-wijsuperpanel-vbar-buttonbottom")){e="bottom";g=true}else if(b.hasClass("wijmo-wijsuperpanel-hbar-buttonleft")){e="left";g=true}else if(b.hasClass("wijmo-wijsuperpanel-hbar-buttonright")){e="right";g=true}else if(b.hasClass(c)){b.addClass("ui-state-active");return}else if(b.hasClass(d)){k=b.find("."+c);n=k.offset();if(i.pageX<n.left)e="left";else e="right";h=true}else if(b.hasClass(j)){l=b.find("."+c);m=l.offset();if(i.pageY<m.top)e="top";else e="bottom";h=true}f._clearInterval();f._doScrolling(e,f,h);o=f._fields();f._setScrollingInterval(o,e,f,h);g&&b.addClass("ui-state-active");a(document).bind("mouseup."+f.widgetName,{self:f,ele:b},f._documentMouseUp)},doScrolling:function(b,a){this._doScrolling(b,this,a)},_setScrollerValue:function(p,b,n,h,o,j,c){var f=b.scrollMin,k=j?h:n,d=b.scrollValue,a,e,g,l,i,m;if(!d)d=f;a=0;if(o){e=b.scrollMax-h+1;if(Math.abs(d-e)<.001){c._clearInterval();return false}g=b.firstStepChangeFix;a=d+k;if(!j&&Math.abs(d-f)<.0001&&!isNaN(g))a+=g;if(a>e)a=e}else{if(Math.abs(d-f)<.001){c._clearInterval();return false}a=d-k;if(a<0)a=f}l={oldValue:b.scrollValue,newValue:a,direction:p,dir:b.dir};if(!c._scrolling(true,c,l))return false;if(c.customScroll){m=Math.abs(c.customScroll);i=c.scrollPxToValue(m,b.dir)}b.scrollValue=i||a;c.customScroll=undefined;return true},_doScrolling:function(a,b,c){var d=b.options,f=d.vScroller,e=d.hScroller,j=b._getVScrollBarSmallChange(),i=b._getVScrollBarLargeChange(),g=b._getHScrollBarLargeChange(),h=b._getHScrollBarSmallChange();if(a==="top"||a==="bottom"){if(!b._setScrollerValue(a,f,j,i,a==="bottom",c,b))return;a="v"}else if(a==="left"||a==="right"){if(!b._setScrollerValue(a,e,h,g,a==="right",c,b))return;a="h"}b._setDragAndContentPosition(true,true,a)},_disableButtonIfNeeded:function(h){var a=h._fields(),c,f,j,g,i,m,o,d,k,n,p,e,l;a.intervalID>0&&window.clearInterval(a.intervalID);c=h.options;f=a.buttonLeft;j=a.buttonRight;g=a.buttonTop;i=a.buttonBottom;if(f!==undefined){m=h._getHScrollBarLargeChange();o=c.hScroller.scrollMax-m+1;d=c.hScroller.scrollValue;k=c.hScroller.scrollMin;if(d===undefined)d=k;if(Math.abs(d-k)<.001||!a.hScrolling)f.addClass(b);else f.removeClass(b);if(Math.abs(d-o)<.001||!a.hScrolling)j.addClass(b);else j.removeClass(b)}if(g!==undefined){n=h._getVScrollBarLargeChange();p=c.vScroller.scrollMax-n+1;e=c.vScroller.scrollValue;l=c.vScroller.scrollMin;if(e===undefined)e=l;if(Math.abs(e-l)<.001||!a.vScrolling)g.addClass(b);else g.removeClass(b);if(Math.abs(e-p)<.001||!a.vScrolling)i.addClass(b);else i.removeClass(b)}},_clearInterval:function(){var b=this._fields(),a=b.internalFuncID;if(a>0){window.clearInterval(a);b.internalFuncID=-1}},_elementMouseOut:function(d){var b=a(d.currentTarget),c=d.data;b.unbind("mouseout",c._elementMouseOut);b.unbind("mousedown",c._elementMouseDown);b.unbind("mouseup",c._elementMouseUp);b.removeClass(f)},_getScrollOffset:function(n){var i=a(n),l,e,m,b,f,c,h,j,g,k,d={left:null,top:null};if(i.size()===0)return d;l=this._fields();e=l.contentWrapper;m=l.templateWrapper;b=i.offset();f=m.offset();b.leftWidth=b.left+i.outerWidth();b.topHeight=b.top+i.outerHeight();c=e.offset();c.leftWidth=c.left+e.outerWidth();c.topHeight=c.top+e.outerHeight();g=b.left-f.left;if(b.left<c.left)d.left=g;else if(b.leftWidth>c.leftWidth){k=b.leftWidth-f.left-e.innerWidth();if(g<k)d.left=g;else d.left=k}h=b.top-f.top;if(b.top<c.top)d.top=h;else if(b.topHeight>c.topHeight){j=b.topHeight-f.top-e.innerHeight();if(h<j)d.top=h;else d.top=j}return d},_scrollDrag:function(c,o,i,n){var a=this,m=a.options,d=c==="v",b=d?m.vScroller:m.hScroller,g=b.scrollMin,q=b.scrollMax,f=b.scrollValue===undefined?g:b.scrollValue-g,p=a._getLargeChange(c),h=q-g-p+1,e=-1,k,l,j;if(f>h)f=h;if(o!==undefined){k=a._getTrackLen(c);l=i[d?"outerHeight":"outerWidth"]();j=a._getScrollContainerPadding(d?"top":"left");e=f/h*(k-l)+j}e>=0&&i.css(d?"top":"left",e+"px");a._scrollEnd(n,a,c)},needToScroll:function(b){var a=this._getScrollOffset(b);return a.top!==null||a.left!==null},scrollChildIntoView:function(d){var a=this._getScrollOffset(d),b=a.left,c=a.top;b!==null&&this.hScrollTo(b);c!==null&&this.vScrollTo(c)},hScrollTo:function(b){var a=this.options;a.hScroller.scrollValue=this.scrollPxToValue(b,"h");this._setDragAndContentPosition(true,true,"h","nonestop")},vScrollTo:function(b){var a=this.options;a.vScroller.scrollValue=this.scrollPxToValue(b,"v");this._setDragAndContentPosition(true,true,"v","nonestop")},scrollPxToValue:function(o,b){var g=this.options,p=b==="h"?"outerWidth":"outerHeight",n=b==="h"?"contentWidth":"contentHeight",e=b==="h"?"hScroller":"vScroller",f=this._fields(),j=f.contentWrapper,l=f[n],h=j[p](),d=g[e].scrollMin,m=g[e].scrollMax,k=m-d,i=b==="h"?this._getHScrollBarLargeChange():this._getVScrollBarLargeChange(),c=k-i+1,a=c*(o/(l-h));if(a<d)a=d;if(a>c)a=c;return a},scrollTo:function(a,b){this.hScrollTo(a);this.vScrollTo(b)},refresh:function(){this.paintPanel()},paintPanel:function(h){var b=this,e=b.element,g,f,c,d;if(e.is(":visible")){g=typeof document.activeElement!="unknown"?document.activeElement:undefined;f=b.options;c=b._fields();!c.initialized&&b._initialize(c,e,b);b._resetLargeChange(b,c,f);b._bindElementEvents(b,c,e,f);d=c.templateWrapper;d.css({"float":"left",left:"0px",top:"0px",width:"auto",height:"auto"});d.hide();d.show();c.contentWidth=d.width();c.contentHeight=d.height();d.css("float","");b._setRounder(b,e);b._setInnerElementsSize(c,e);if(b._testScroll(b,c,f)===false)return false;b._initScrollBars(b,c,f);b._initScrollButtons(b,c,f);b._trigger("painted");b._paintedMark={date:new Date,mainWidth:e[0].offsetWidth,mainHeight:e[0].offsetHeight,width:c.contentWidth,height:c.contentWidth};g!==undefined&&!h&&a(g).focus();return true}return false},_resetLargeChange:function(d,a,e){var b;if(d._autoVLarge)e.vScroller.scrollLargeChange=null;if(d._autoHLarge)e.hScroller.scrollLargeChange=null;a.vTrackLen=undefined;a.hTrackLen=undefined;if(a.vbarContainer){b=a.vbarContainer.children("."+c+":eq(0)");b.detach();a.vbarContainer.remove();a.vbarContainer=undefined}if(a.hbarContainer){b=a.hbarContainer.children("."+c+":eq(0)");b.detach();a.hbarContainer.remove();a.hbarContainer=undefined}},_initialize:function(b,a,c){b.initialized=true;a.addClass(i);b.oldHeight=a.css("height");var d=a.css("overflow");a.css("overflow","");a.height(a.height());a.css("overflow",d);c._createAdditionalDom(c,b,a)},getContentElement:function(){return this._fields().templateWrapper},_setButtonPosition:function(f,s,g,r,n,d,k){var b=r==="h",q="mouseover."+f.widgetName,i=b?"buttonLeft":"buttonTop",j=b?"buttonRight":"buttonBottom",e=d[i],h=d[j],p,l,c;if(f._hasMode(g,"buttons")||f._hasMode(g,"buttonshover")){p=b?m:o;if(e===undefined){l=a(p).appendTo(k);l.bind(q,f,f._scrollButtonMouseOver);d[i]=e=k.children(b?".wijmo-wijsuperpanel-buttonleft":".wijmo-wijsuperpanel-buttontop");d[j]=h=k.children(b?".wijmo-wijsuperpanel-buttonright":".wijmo-wijsuperpanel-buttonbottom")}c={my:b?"left":"top",of:n,at:b?"left":"top",collision:"none"};a.extend(c,g.decreaseButtonPosition);e.position(c);c={my:b?"right":"bottom",of:n,at:b?"right":"bottom",collision:"none"};a.extend(c,g.increaseButtonPosition);h.position(c)}else if(e!==undefined){e.remove();h.remove();d[i]=d[j]=undefined}},_initScrollButtons:function(a,b,c){var e=b.contentWrapper,d=b.stateContainer;a._setButtonPosition(a,c,c.hScroller,"h",e,b,d);a._setButtonPosition(a,c,c.vScroller,"v",e,b,d)},_getVScrollBarSmallChange:function(){var a=this.options,b;if(!a.vScroller.scrollSmallChange){b=this._getVScrollBarLargeChange();a.vScroller.scrollSmallChange=b/2}return a.vScroller.scrollSmallChange},_getVScrollBarLargeChange:function(){return this._getLargeChange("v")},_getLargeChange:function(q){var f=this,m=f.options,l=f._fields(),c=q==="v",a=c?m.vScroller:m.hScroller,n=c?"innerHeight":"innerWidth",o=c?"contentHeight":"contentWidth",p=c?"_autoVLarge":"_autoHLarge",j,k,i,h,d,g,e,b;if(a.scrollLargeChange)return a.scrollLargeChange;j=a.scrollMax;k=a.scrollMin;i=j-k;h=l.contentWrapper;d=h[n]();g=l[o];e=d/(g-d);b=(i+1)*e/(1+e);if(isNaN(b))b=0;a.scrollLargeChange=b;f[p]=true;return a.scrollLargeChange},_getHScrollBarSmallChange:function(){var a=this.options,b;if(!a.hScroller.scrollSmallChange){b=this._getHScrollBarLargeChange();a.hScroller.scrollSmallChange=b/2}return a.hScroller.scrollSmallChange},_getHScrollBarLargeChange:function(){return this._getLargeChange("h")},_initScrollBars:function(b,r,e){var p=e.hScroller,u=p.scrollMax,v=p.scrollMin,s=u-v,q=e.vScroller,w=q.scrollMax,x=q.scrollMin,t=w-x,c=r.hbarDrag,d=r.vbarDrag,l,j,g,o,k,m,h,f,n,i;if(b.hNeedScrollBar&&c.is(":visible")){l=b._getHScrollBarLargeChange();j=b._getTrackLen("h");g=b._getDragLength(s,l,j,e.hScroller.scrollMinDragLength);c.width(g);o=c.outerWidth(true)-c.width();c.width(g-o);k=c.children("span");k.css("margin-left",(c.width()-k[0].offsetWidth)/2);if(j<=c.outerWidth(true))c.hide();else c.show();if(b._isDragging==true){a(document).trigger("mouseup");b._isDragging=false}}if(b.vNeedScrollBar&&d.is(":visible")){m=b._getVScrollBarLargeChange();h=b._getTrackLen("v");f=b._getDragLength(t,m,h,e.vScroller.scrollMinDragLength);d.height(f);n=d.outerHeight(true)-d.height();d.height(f-n);i=d.children("span");i.css("margin-top",(d.height()-i[0].offsetHeight)/2);if(h<=d.outerHeight(true))d.hide();else d.show();if(b._isDragging==true){a(document).trigger("mouseup");b._isDragging=false}}b._setDragAndContentPosition(false,false,"both")},_getTrackLen:function(f){var e=this,a=e._fields(),d=f+"TrackLen",g,h,c,b;if(a[d]!==undefined)return a[d];g=a.hbarContainer;h=a.vbarContainer;c=0;b=0;if(f==="h"){b=e._getScrollContainerPadding("h");c=g.innerWidth()}if(f==="v"){b=e._getScrollContainerPadding("v");c=h.innerHeight()}a[d]=c-b;return a[d]},_getScrollContainerPadding:function(b){var d=this,e=d._fields(),a=0,c,f;if(b==="h")a=d._getScrollContainerPadding("left")+d._getScrollContainerPadding("right");else if(b==="v")a=d._getScrollContainerPadding("top")+d._getScrollContainerPadding("bottom");else{if(b==="left"||b==="right")c=e.hbarContainer;else c=e.vbarContainer;f=b+"Padding";if(e[f]!==undefined){a=e[f];return a}if(c&&c.css)a=parseFloat(c.css("padding-"+b));e[f]=a}return a},_triggerScroll:function(b,d,a){var c={position:b,dir:d,animationOptions:a};this._trigger("scroll",null,c)},_contentDragAnimate:function(e,q,C,i,A,o,w){var b=this,d=b.options,f=e==="v",j=f?d.vScroller:d.hScroller,H=f?"outerHeight":"outerWidth",I=f?"innerHeight":"innerWidth",E=f?"contentHeight":"contentWidth",F=f?"top":"left",r=j.scrollMin,K=j.scrollMax,J=K-r,h=j.scrollValue===undefined?r:j.scrollValue-r,D=b._getLargeChange(e),m=J-D+1,t=b._fields(),G=t.contentWrapper,l=t.templateWrapper,c,g,y,z,B,x,n,v,k,p,u,s;if(h>m)h=m;c=(t[E]-G[I]())*(h/m);if(Math.abs(c)<.001)c=0;c=Math.round(c);g=-1;if(C!==undefined){q&&i.is(":animated")&&A!=="nonestop"&&i.stop(true,false);y=b._getTrackLen(e);z=i[H](true);B=y-z;x=b._getScrollContainerPadding(F);g=h/m*B+x}if(q&&d.animationOptions&&!d.animationOptions.disabled){if(g>=0&&w!=="dragging"){n=a.extend({},d.animationOptions);n.complete=undefined;v=f?{top:g}:{left:g};i.animate(v,n)}k=a.extend({},d.animationOptions);p=d.animationOptions.complete;k.complete=function(){b._scrollEnd(o,b,e);a.isFunction(p)&&p(arguments)};q&&l.is(":animated")&&A!=="nonestop"&&l.stop(true,false);u=f?{top:-c}:{left:-c};if(!d.customScrolling)l.animate(u,k);else b._scrollEnd(o,b,e,h);b._triggerScroll(c,e,k)}else if(j.scrollBarVisibility!=="hidden"){s=f?"top":"left";if(g>=0&&w!=="dragging")i[0].style[s]=g+"px";if(!d.customScrolling)l[0].style[s]=-c+"px";b._triggerScroll(c,e);b._scrollEnd(o,b,e,h)}},_setDragAndContentPosition:function(d,e,c,g,f){var b=this,a=b._fields(),h=a.hbarContainer,j=a.hbarDrag,i=a.vbarContainer,k=a.vbarDrag;(c==="both"||c==="h")&&a.hScrolling&&b._contentDragAnimate("h",e,h,j,g,d,f);(c==="both"||c==="v")&&a.vScrolling&&b._contentDragAnimate("v",e,i,k,g,d,f);a.intervalID>0&&window.clearInterval(a.intervalID);a.intervalID=window.setInterval(function(){b._disableButtonIfNeeded(b)},500)},_scrolling:function(d,a,b){var c=true;if(d){b.beforePosition=a.getContentElement().position();a._beforePosition=b.beforePosition;c=a._trigger("scrolling",null,b);a.customScroll=b.customScroll}return c},_scrollEnd:function(c,a,d,b){c&&window.setTimeout(function(){var f=a.getContentElement(),e,c;if(!f.is(":visible"))return;e=a.getContentElement().position();c={dir:d,beforePosition:a._beforePosition,afterPosition:e};if(!isNaN(b))c.newValue=b;a._trigger("scrolled",null,c)},0)},_getDragLength:function(f,d,b,g){var e=f/d,a=b/e,c=g;if(a<c)a=c;else if(a+1>=b)a=b-1;return Math.round(a)},_needScrollbar:function(b,e){var d=this._hasMode(b,"scrollbar"),a=b.scrollBarVisibility,c=d&&(a==="visible"||a==="auto"&&e);return c},_bindBarEvent:function(d,e,c){var b=this;d.bind("mouseover."+b.widgetName,b,b._scrollerMouseOver);e.draggable({axis:c==="h"?"x":"y",start:function(){b._isDragging=true},drag:function(c,a){b._dragging(c,a,b)},containment:"parent",stop:function(d){b._dragStop(d,b,c);a(d.target).removeClass("ui-state-active");b._isDragging=false}})},_createBarIfNeeded:function(o,m,e,q,i){if(o){var h=this,j,l=h._fields(),n=e+"barContainer",p=e+"barDrag",b=e==="h",d=i[b?"innerHeight":"innerWidth"](),f=l[n]=a(q),g,k;m.append(f);g=f[0][b?"offsetHeight":"offsetWidth"];d=d-g;j={direction:b?"horizontal":"vertical",targetBarLen:g,contentLength:d};if(h._trigger(b?"hScrollerActivating":"vScrollerActivating",null,j)===false)return false;k=l[p]=f.find("."+c);h._bindBarEvent(f,k,e);i[b?"height":"width"](d)}},_setScrollbarPosition:function(u,p,f,a,s,r,h,q,c,g,t){var b=g==="h",e,m,i,n,j,o,k,l,d;if(r){e=a[0][b?"offsetHeight":"offsetWidth"];m=p._getScrollContainerPadding(g);i=b?"top":"left";n=b?{top:"0px",bottom:"auto",left:"auto",right:"auto"}:{left:"0px",right:"auto",top:"auto",bottom:"auto"};j=b?{top:e+"px"}:{left:e+"px"};o=b?{top:"auto",right:"auto",left:"auto",bottom:"0px"}:{left:"auto",right:"0px",top:"auto",bottom:"auto"};k=b?{top:""}:{left:""};l=f[b?"innerWidth":"innerHeight"]();if(q===i){a.css(n);f.css(j);if(b){a.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass("ui-corner-bl").addClass("ui-corner-tl");a.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass("ui-corner-br").addClass("ui-corner-tr");a.removeClass("ui-corner-bottom").addClass("ui-corner-top")}else{a.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass("ui-corner-tr").addClass("ui-corner-tl");a.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass("ui-corner-br").addClass("ui-corner-bl");a.removeClass("ui-corner-right").addClass("ui-corner-left")}}else{a.css(o);f.css(k);if(b){a.children(".wijmo-wijsuperpanel-hbar-buttonleft").removeClass("ui-corner-tl").addClass("ui-corner-bl");a.children(".wijmo-wijsuperpanel-hbar-buttonright").removeClass("ui-corner-bl").addClass("ui-corner-br");a.removeClass("ui-corner-top").addClass("ui-corner-bottom")}else{a.children(".wijmo-wijsuperpanel-vbar-buttontop").removeClass("ui-corner-tl").addClass("ui-corner-tr");a.children(".wijmo-wijsuperpanel-vbar-buttonbottom").removeClass("ui-corner-bl").addClass("ui-corner-br");a.removeClass("ui-corner-left").addClass("ui-corner-right")}}d=0;if(h){d=s[0][b?"offsetWidth":"offsetHeight"];if(c==="left")a.css("right","0px");else if(c==="right")a.css("left","0px");else if(c==="top")a.css("bottom","0px");else c==="bottom"&&a.css("top","0px")}if(!b&&h)d=0;a[b?"width":"height"](l-m);p._enableDisableScrollBar(g,a,!t)}else u.css(b?"left":"top","")},_testScroll:function(b,a,g){var d=a.templateWrapper,e=a.contentWrapper,h=a.stateContainer,p=e.innerWidth(),o=e.innerHeight(),r=a.contentWidth,q=a.contentHeight,c,f,i,j,l,m;a.hScrolling=r>p;a.vScrolling=q>o;c=b.hNeedScrollBar=b._needScrollbar(g.hScroller,a.hScrolling);if(b._createBarIfNeeded(c,h,"h",k,e)===false)return false;if(c&&!a.vScrolling){d.css("float","left");a.contentHeight=d.height();a.vScrolling=a.contentHeight>o-a.hbarContainer[0].offsetHeight;d.css("float","")}f=b.vNeedScrollBar=b._needScrollbar(g.vScroller,a.vScrolling);if(b._createBarIfNeeded(f,h,"v",n,e)===false)return false;if(f&&!a.hScrolling){d.css("float","left");a.contentWidth=d.width();a.hScrolling=a.contentWidth>p-a.vbarContainer[0].offsetWidth;d.css("float","");if(a.hScrolling&&!c){c=b.hNeedScrollBar=b._needScrollbar(g.hScroller,a.hScrolling);if(b._createBarIfNeeded(c,h,"h",k,e)===false)return false}}i=a.hbarContainer;j=a.vbarContainer;l=g.hScroller.scrollBarPosition;m=g.vScroller.scrollBarPosition;b._setScrollbarPosition(d,b,e,i,j,c,f,l,m,"h",a.hScrolling);b._setScrollbarPosition(d,b,e,j,i,f,c,m,l,"v",a.vScrolling)},_enableDisableScrollBar:function(f,a,d){if(f==="v"){a[d?"addClass":"removeClass"]("wijmo-wijsuperpanel-vbarcontainer-disabled");a.find("."+e)[d?"addClass":"removeClass"](b)}else if(f==="h"){a[d?"addClass":"removeClass"]("wijmo-wijsuperpanel-hbarcontainer-disabled");a.find("."+e)[d?"addClass":"removeClass"](b)}a.children("."+c)[d?"hide":"show"]()},_initResizer:function(){var b=this,g=b.options,d=b._fields(),f=d.resizer,c,e;if(!f&&g.allowResize){c=g.resizableOptions;e=c.stop;c.stop=function(c){b._resizeStop(c,b);a.isFunction(e)&&e(c)};d.resizer=f=b.element.resizable(c)}if(!g.allowResize&&d.resizer){f.resizable("destroy");d.resizer=null}},_resizeStop:function(b,a){!this.options.autoRefresh&&a.paintPanel(true);a._trigger("resized")},_createAdditionalDom:function(f,b,c){if(!c.attr("tabindex")){c.attr("tabindex","-1");b.tabindex=true}var d=b.stateContainer=a(l),e;b.contentWrapper=d.children();e=b.templateWrapper=b.contentWrapper.children();c.contents().each(function(f,d){var c=a(d);if(c.hasClass("wijmo-wijsuperpanel-header")){b.header=c;return}if(c.hasClass("wijmo-wijsuperpanel-footer")){b.footer=c;return}e[0].appendChild(d)});b.header!==undefined&&c.prepend(b.header);c[0].appendChild(d[0]);b.footer!==undefined&&b.footer.insertAfter(d)},_setRounder:function(e,d){if(this.options.showRounder){d.addClass(h);if(e._rounderAdded)return;if(a.browser.msie)return;var b,c,g,f;b=c="";if(a.browser.webkit){c="WebkitBorderTopLeftRadius";b="WebkitBorderRadius"}else if(a.browser.mozilla){c="MozBorderRadiusBottomleft";b="MozBorderRadius"}else{c="border-top-left-radius";b="border-radius"}g=d.css(c);f=parseInt(g,10);d.css(b,f+1);e._rounderAdded=true;e._radiusKey=b}else d.removeClass(h)},_setInnerElementsSize:function(a,g){var i=a.stateContainer,h=a.contentWrapper,e=0,b,c,d,f;if(a.header!==undefined)e+=a.header.outerHeight();if(a.footer!==undefined)e+=a.footer.outerHeight();b=i[0].style;c=g.innerHeight()-e;d=g.innerWidth();b.display="none";b.height=c+"px";b.width=d+"px";f=h[0].style;f.height=c+"px";f.width=d+"px";b.display=""}})})(jQuery);
(function(a){"use strict";a.widget("wijmo.wijtextbox",{options:{},_create:function(){var b=this,c=b.element,f={input:true,textarea:true},e={text:true,password:true,email:true,url:true},d=c.get(0).nodeName.toLowerCase();if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);if(!f.hasOwnProperty(d))return;if(d==="input"&&!e.hasOwnProperty(b.element.attr("type").toLowerCase()))return;c.addClass("wijmo-wijtextbox ui-widget ui-state-default ui-corner-all");b.element.bind("mouseover."+b.widgetName,function(){c.addClass("ui-state-hover")}).bind("mouseout."+b.widgetName,function(){c.removeClass("ui-state-hover")}).bind("mousedown."+b.widgetName,function(){c.addClass("ui-state-active")}).bind("mouseup."+b.widgetName,function(){c.removeClass("ui-state-active")}).bind("focus."+b.widgetName,function(){c.addClass("ui-state-focus")}).bind("blur."+b.widgetName,function(){c.removeClass("ui-state-focus")});if(c.is(":disabled")){b._setOption("disabled",true);c.addClass("ui-state-disabled")}else{b._setOption("disabled",false);c.removeClass("ui-state-disabled")}},destroy:function(){var b=this;b.element.removeClass("ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active wijmo-wijtextbox").unbind("."+b.widgetName);a.Widget.prototype.destroy.apply(b)}})})(jQuery);
(function(a){"use strict";a.widget("wijmo.wijdropdown",{options:{zIndex:1e3,showingAnimation:{effect:"blind"},hidingAnimation:{effect:"blind"}},hoverClass:"ui-state-hover",activeClass:"ui-state-active",focusClass:"ui-state-focus",_setOption:function(c,b){a.Widget.prototype._setOption.apply(this,arguments);if(c==="disabled"){this._labelWrap.toggleClass("ui-state-disabled",b);this.element.attr("disabled",b?"disabled":"")}},_create:function(){var b=this,c=b.element;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);if(c.get(0).tagName.toLowerCase()!=="select")return;if(c.is(":visible")){b._activeItem=null;b._createSelect();b._bindEvents();b.needInit=false}else b.needInit=true;b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b.refresh();b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijdropdown")},_createSelect:function(){var b=this,c=b.element,k=c.width(),f=k,j=c.wrap("<div></div>").parent().addClass("ui-helper-hidden"),d=j.wrap("<div></div>").parent().attr("role","select").addClass("wijmo-wijdropdown ui-widget ui-widwijmo-wijdropdownt-content ui-state-default ui-corner-all ui-helper-clearfix"),h=a('<label class="wijmo-dropdown-label ui-corner-all"></label>').attr("id",c.get(0).id+"_select").attr("name",c.attr("name")||""),i=a("<div></div>").addClass("wijmo-dropdown-trigger ui-state-default ui-corner-right"),e=a('<a href="#"></a>'),g=a("<div>").addClass("wijmo-dropdown"),l=a("<ul></ul>").addClass("wijmo-dropdown-list ui-widget-content ui-widget ui-corner-all ui-helper-reset").appendTo(g);a("<span></span>").addClass("ui-icon ui-icon-triangle-1-s").appendTo(i);k=Math.max(k,d.width());c.get(0).tabIndex!==""&&e.attr("tabindex",c.attr("tabindex"));if(c.get(0).disabled!==false){b.options.disabled=true;e.addClass("ui-state-disabled")}e.append(h);d.append(j).append(e).append(i).append(g);f+=parseInt(h.css("padding-left").replace(/px/,""),10);f+=parseInt(h.css("padding-right").replace(/px/,""),10);f-=16;d.width(f);b._buildList(l,g,f);b._rightTrigger=i;b._label=h;b._listContainer=g;b._list=l;b._value=c.val();b._selectedIndex=a("option",c).index(c.find("option:selected"));b._selectWrap=j;b._labelWrap=e;b._container=d;d.attr("title",c.attr("title"));c.removeAttr("title")},_buildList:function(c,b,f){var d=this,g=d.element,e;b.show();g.children().each(function(i,h){var b=a(h),f,g,e;if(b.is("option"))c.append(d._buildItem(b));else{f=a('<li class="wijmo-dropdown-optgroup"></li>');g=a("<span>"+b.attr("label")+"</span>").addClass("wijmo-optgroup-header ui-priority-primary");e=a("<ul></ul>").addClass("ui-helper-reset wijmo-dropdown-items");b.children("option").each(function(){e.append(d._buildItem(a(this)))});f.append(g).append(e);c.append(f)}});b.height("");e=b.height();e=c.outerHeight()<e?c.outerHeight():e;b.css({height:e,width:f});c.setOutWidth(c.parent().parent().innerWidth()-18);if(b.data("wijsuperpanel")){b.wijsuperpanel("paintPanel");d.superpanel=b.data("wijsuperpanel")}else d.superpanel=b.wijsuperpanel().data("wijsuperpanel");a.fn.bgiframe&&d.superpanel.element.bgiframe();if(!d.superpanel.vNeedScrollBar){c.setOutWidth(c.parent().parent().innerWidth());d.superpanel.refresh()}b.hide()},_handelEvents:function(d){var a=this,b="."+a.widgetName,c=a.element;d.bind("click"+b,function(b){if(a.options.disabled)return;if(a._listContainer.is(":hidden"))a._show();else a._hide();c.click();if(d.get(0)===a._label.get(0))b.preventDefault();else a._labelWrap.focus()}).bind("mouseover"+b,function(){if(a.options.disabled)return;a._label.addClass(a.hoverClass);a._rightTrigger.addClass(a.hoverClass);c.trigger("mouseover")}).bind("mouseout"+b,function(){if(a.options.disabled)return;a._label.removeClass(a.hoverClass);a._rightTrigger.removeClass(a.hoverClass);c.trigger("mouseout")}).bind("mousedown"+b,function(){if(a.options.disabled)return;a._label.addClass(a.activeClass);a._rightTrigger.addClass(a.activeClass);c.trigger("mousedown")}).bind("mouseup"+b,function(){if(a.options.disabled)return;a._label.removeClass(a.activeClass);a._rightTrigger.removeClass(a.activeClass);c.trigger("mouseup")})},_bindEvents:function(){var b=this,d="."+b.widgetName,h=b._label,g=b._rightTrigger,i=b._labelWrap,c=b._listContainer,e=b.element,f;b._handelEvents(b._label);b._handelEvents(b._rightTrigger);a(document.body).bind("click"+d,function(a){if(c.is(":hidden"))return;f=c.offset();if(a.target===h.get(0)||a.target===g.get(0)||a.target===g.children().get(0))return;(a.pageX<f.left||a.pageX>f.left+c.width()||a.pageY<f.top||a.pageY>f.top+c.height())&&b._hide()});c.bind("click"+d,function(f){var d=a(f.target);if(d.closest("li.wijmo-dropdown-item",a(this)).length>0){b._setValue();c.css("z-index","");a.browser.msie&&/^[6,7].[0-9]+/.test(a.browser.version)&&c.parent().css("z-index","");c.hide();b._setValueToEle()}e.click()});i.bind("keydown"+d,function(d){if(b.options.disabled)return;var c=a.ui.keyCode;switch(d.which){case c.UP:case c.LEFT:b._previous();b._setValue();b._setValueToEle();break;case c.DOWN:case c.RIGHT:b._next();b._setValue();b._setValueToEle();break;case c.PAGE_DOWN:b._nextPage();b._setValue();b._setValueToEle();break;case c.PAGE_UP:b._previousPage();b._setValue();b._setValueToEle();break;case c.ENTER:case c.NUMPAD_ENTER:b._setValue();b._listContainer.hide();b._setValueToEle()}d.which!==c.TAB&&d.preventDefault();e.trigger("keydown")}).bind("focus"+d,function(){if(b.options.disabled)return;h.addClass(b.focusClass);g.addClass(b.focusClass);e.focus()}).bind("blur"+d,function(){if(b.options.disabled)return;h.removeClass(b.focusClass);g.removeClass(b.focusClass);e.trigger("blur")}).bind("keypress"+d,function(){if(b.options.disabled)return;e.trigger("keypress")}).bind("keyup"+d,function(){if(b.options.disabled)return;e.trigger("keyup")})},_init:function(){var a=this;a._initActiveItem();a._activeItem&&a._label.text(a._activeItem.text())},_buildItem:function(d){var f=d.val(),b=d.text(),e=this,c;if(b==="")b="&nbsp;";c=a('<li class="wijmo-dropdown-item ui-corner-all"><span>'+b+"</span></li>").mousemove(function(b){var c=a(b.target).closest(".wijmo-dropdown-item");c!==this.last&&e._activate(a(this));this.last=a(b.target).closest(".wijmo-dropdown-item")}).attr("role","option");c.data("value",f);return c},_show:function(){var d=this,c=d._listContainer,b=d.options.showingAnimation;c.css("z-index","100000");a.browser.msie&&/^[6,7]\.[0-9]+/.test(a.browser.version)&&c.parent().css("z-index","99999");if(b)c.show(b.effect,b.options,b.speed,function(){d._initActiveItem()});else c.show()},_hide:function(){var d=this,b=d._listContainer,c=d.options.hidingAnimation;if(b.is(":hidden"))return;if(c)b.hide(c.effect,c.options,c.speed,function(){a.isFunction(c.callback)&&c.callback.apply(d,arguments);a.browser.msie&&/^[6,7]\.[0-9]+/.test(a.browser.version)&&b.parent().css("z-index","");b.css("z-index","")});else{a.browser.msie&&a.browser.version==="6.0"&&b.parent().css("z-index","");b.css("z-index","");b.hide()}},_setValue:function(){var b=this,c=b._listContainer,d,e;if(b._activeItem){b._label.text(b._activeItem.text());b._value=b._activeItem.data("value");b._selectedIndex=a("li.wijmo-dropdown-item",c).index(b._activeItem);if(b.superpanel.vNeedScrollBar){d=b._activeItem.offset().top;e=b._activeItem.outerHeight();if(c.offset().top>d)c.wijsuperpanel("scrollTo",0,d-b._list.offset().top);else c.offset().top<d+e-c.innerHeight()&&c.wijsuperpanel("scrollTo",0,d+e-c.height()-b._list.offset().top)}}},_setValueToEle:function(){var e=this,b=e.element,c=b.find("option[selected]"),f=a("option",b).index(c),d=e._selectedIndex;if(f!==d){c.removeAttr("selected");b.find("option:eq("+d+")").attr("selected",true);b.trigger("change")}},_initActiveItem:function(){var b=this;if(b._value!==undefined){if(b._selectedIndex===-1){b._activate(b._list.find("li.wijmo-dropdown-item").eq(0));return}b._list.find("li.wijmo-dropdown-item").each(function(c){if(c===b._selectedIndex){b._activate(a(this));return false}})}},_activate:function(b){var a=this;a._deactivate();a._activeItem=b;a._activeItem.addClass(a.hoverClass).attr("aria-selected",true)},_deactivate:function(){var a=this;a._activeItem&&a._activeItem.removeClass(a.hoverClass).attr("aria-selected",false)},_next:function(){this._move("next","first")},_previous:function(){this._move("prev","last")},_nextPage:function(){this._movePage("first")},_previousPage:function(){this._movePage("last")},refresh:function(){var b=this,d=b.element,c;if(b.needInit){if(b.element.is(":visible")){b._activeItem=null;b._createSelect();b._bindEvents();b._init();b.needInit=false}}else{if(!b._list)return;b._listContainer.show();b._selectWrap.removeClass("ui-helper-hidden");c=b.element.width();c+=parseInt(b._label.css("padding-left").replace(/px/,""),10);c+=parseInt(b._label.css("padding-right").replace(/px/,""),10);c-=16;b._container.width(c);b._selectWrap.addClass("ui-helper-hidden");b._list.empty();b._buildList(b._list,b._listContainer,c);b._value=b.element.val();b._selectedIndex=a("option",d).index(d.find("option:selected"));b._initActiveItem();b._activeItem&&b._label.text(b._activeItem.text())}},_move:function(c,d){var a=this,e,b;if(!a._activeItem){a._activate(a._list.find(".wijmo-dropdown-item:"+d));return}e=a._activeItem[c]().eq(0);if(e.length)b=a._getNextItem(e,c,d);else if(a._activeItem.closest(".wijmo-dropdown-optgroup").length)b=a._getNextItem(a._activeItem.closest(".wijmo-dropdown-optgroup")[c](),c,d);if(b&&b.length)a._activate(b);else a._activate(a._list.find(".wijmo-dropdown-item:"+d))},_movePage:function(d){var b=this,g,e,c,f=d==="first"?"last":"first";if(b.superpanel.vNeedScrollBar){g=b._activeItem.offset().top;e=b.options.height;c=b._list.find(".wijmo-dropdown-item").filter(function(){var c=a(this).offset().top-g+(d==="first"?-e:e)+a(this).height(),b=a(this).height();return c<b&&c>-b});if(!c.length)c=b._list.find(".wijmo-dropdown-item:"+f);b._activate(c)}else b._activate(b._list.find(".wijmo-dropdown-item:"+(!b._activeItem?d:f)))},_getNextItem:function(a,b,c){if(a.length)if(a.is(".wijmo-dropdown-optgroup"))if(!!a.find(">ul>li.wijmo-dropdown-item").length)return a.find(">ul>li.wijmo-dropdown-item:"+c).eq(0);else this._getNextItem(a[b]().eq(0));else return a},destroy:function(){this.element.attr("title",this._container.attr("title"));this.element.closest(".wijmo-wijdropdown").find(">div.wijmo-dropdown-trigger,>div.wijmo-dropdown,>a").remove();this.element.unwrap().unwrap().removeData("maxZIndex");a.Widget.prototype.destroy.apply(this)}})})(jQuery);
(function(a){"use strict";var b=0;a.widget("wijmo.wijcheckbox",{_csspre:"wijmo-checkbox",options:{checked:null,changed:null},_init:function(){var c=this,d=c.element,g=c.options,f,i,h,e,j;if(d.is(":checkbox")){if(!d.attr("id")){d.attr("id",c._csspre+b);b+=1}if(d.parent().is("label")){f=d.parent().wrap("<div class='"+c._csspre+"-inputwrapper'></div>").parent().wrap("<div></div>").parent().addClass(c._csspre+" ui-widget");i=d.parent();i.attr("for",d.attr("id"));f.find("."+c._csspre+"-inputwrapper").append(d);f.append(i)}else f=d.wrap("<div class='"+c._csspre+"-inputwrapper'></div>").parent().wrap("<div></div>").parent().addClass(c._csspre+" ui-widget");h=a("label[for='"+d.attr("id")+"']");if(h.length>0){f.append(h);h.attr("labelsign","C1")}d.is(":disabled")&&c._setOption("disabled",true);e=a("<div class='"+c._csspre+"-box ui-widget ui-state-"+(g.disabled?"disabled":"default")+" ui-corner-all'><span class='"+c._csspre+"-icon'></span></div>");j=e.children("."+c._csspre+"-icon");f.append(e);d.data("iconElement",j);d.data("boxElement",e);d.data("checkboxElement",f);e.removeClass(c._csspre+"-relative").attr("role","checkbox").bind("mouseover",function(){d.mouseover()}).bind("mouseout",function(){d.mouseout()});(h.length===0||h.html()==="")&&e.addClass(c._csspre+"-relative");d.bind("click.checkbox",function(a){if(g.disabled)return;c.refresh(a);c._trigger("changed",null,{checked:c.options.checked})}).bind("focus.checkbox",function(){if(g.disabled)return;e.removeClass("ui-state-default").addClass("ui-state-focus")}).bind("blur.checkbox",function(){if(g.disabled)return;e.removeClass("ui-state-focus").not(".ui-state-hover").addClass("ui-state-default")}).bind("keydown.checkbox",function(a){if(a.keyCode===32){if(g.disabled)return;c.refresh()}});e.bind("click.checkbox",function(a){if(g.disabled)return;d.get(0).checked=!d.get(0).checked;d.change();d.focus();c.refresh(a);c._trigger("changed",null,{checked:c.options.checked})});c._initCheckState();c.refresh();f.bind("mouseover.checkbox",function(){if(g.disabled)return;e.removeClass("ui-state-default").addClass("ui-state-hover")}).bind("mouseout.checkbox",function(){if(g.disabled)return;e.removeClass("ui-state-hover").not(".ui-state-focus").addClass("ui-state-default")});f.attr("title",d.attr("title"))}},_create:function(){if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a)},_setOption:function(e,c){var b=this,d=b.options.checked;a.Widget.prototype._setOption.apply(this,arguments);if(e==="checked"){b.element.get(0).checked=c;b.refresh();d!==c&&b._trigger("changed",null,{checked:c})}},_initCheckState:function(){var b=this,a=b.options;if(a.checked!==undefined&&a.checked!==null)b.element.get(0).checked=a.checked},refresh:function(b){var a=this,c=a.options;c.checked=a.element.get(0).checked;a.element.data("iconElement").toggleClass("ui-icon ui-icon-check",a.element.get(0).checked);a.element.data("boxElement").toggleClass("ui-state-active",a.element.get(0).checked).attr("aria-checked",a.element.get(0).checked);a.element.data("checkboxElement").toggleClass("ui-state-checked",a.element.get(0).checked);b&&b.stopPropagation()},destroy:function(){var b=this,c=b.element.parent().parent();c.children("div."+b._csspre+"-box").remove();b.element.unwrap();b.element.unwrap();a.Widget.prototype.destroy.apply(b)}})})(jQuery);
(function(a){"use strict";var b=0;a.widget("wijmo.wijradio",{_radiobuttonPre:"wijmo-wijradio",options:{checked:null,changed:null},_create:function(){var c=this,d=c.element,h,e,j,g,f,i;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);if(d.is(":radio")){if(!d.attr("id")){d.attr("id","wijmo-radio-"+b);b+=1}if(d.parent().is("label")){e=d.parent().wrap("<div class='"+c._radiobuttonPre+"-inputwrapper'></div>").parent().wrap("<div></div>").parent().addClass(c._radiobuttonPre+" ui-widget");j=d.parent();j.attr("for",d.attr("id"));e.find("."+c._radiobuttonPre+"-inputwrapper").append(d);e.append(j)}else e=d.wrap("<div class='"+c._radiobuttonPre+"-inputwrapper'></div>").parent().wrap("<div></div>").parent().addClass(c._radiobuttonPre+" ui-widget");g=a("label[for='"+d.attr("id")+"']");if(g.length>0){e.append(g);g.attr("labelsign","wij")}d.is(":disabled")&&c._setOption("disabled",true);f=a("<div class='"+c._radiobuttonPre+"-box ui-widget "+(c.options.disabled?"ui-state-disabled":"ui-state-default")+" ui-corner-all'><span class='"+c._radiobuttonPre+"-icon'></span></div>");i=f.children("."+c._radiobuttonPre+"-icon");e.append(f);i.addClass("ui-icon ui-icon-radio-on");d.data("iconElement",i);d.data("boxElement",f);d.data("radiobuttonElement",e);f.removeClass(c._radiobuttonPre+"-relative").attr("role","radio").bind("mouseover",function(){d.mouseover()}).bind("mouseout",function(){d.mouseout()});(g.length===0||g.html()==="")&&f.addClass(c._radiobuttonPre+"-relative");c._setDefaul();d.bind("click.radio",function(){if(c.options.disabled)return;h=c.options.checked;c._refresh();h!==c.element.is(":checked")&&c._trigger("changed",null,{checked:c.options.checked})}).bind("focus.radio",function(){if(c.options.disabled)return;f.removeClass("ui-state-default").addClass("ui-state-focus")}).bind("blur.radio",function(){if(c.options.disabled)return;f.removeClass("ui-state-focus").not(".ui-state-hover").addClass("ui-state-default")});e.click(function(){if(c.options.disabled)return;if(g.length===0||g.html()===""){h=c.options.checked;d.attr("checked",true);c._refresh();d.change();h!==c.element.is(":checked")&&c._trigger("changed",null,{checked:c.options.checked})}});e.bind("mouseover.radio",function(){if(c.options.disabled)return;f.removeClass("ui-state-default").addClass("ui-state-hover")}).bind("mouseout.radio",function(){if(c.options.disabled)return;f.removeClass("ui-state-hover").not(".ui-state-focus").addClass("ui-state-default")});e.attr("title",d.attr("title"))}},_setOption:function(e,c){var b=this,d=b.options.checked;a.Widget.prototype._setOption.apply(this,arguments);if(e==="checked"){b.element.attr("checked",c);b._refresh();d!==c&&b._trigger("changed",null,{checked:c})}},_setDefaul:function(){var b=this,a=b.options;a.checked!==undefined&&a.checked!==null&&this.element.attr("checked",a.checked);if(this.element.attr("checked")){this.element.parents(".wijmo-wijradio").find("."+this._radiobuttonPre+"-box").children().removeClass("ui-icon-radio-on ui-icon-radio-off").addClass("ui-icon-radio-off");this.element.data("boxElement").removeClass("ui-state-default").addClass("ui-state-active").attr("aria-checked",true);this.element.data("radiobuttonElement").addClass("ui-state-checked")}},_refresh:function(){var d=this.element.attr("name")||"",b=this,c;if(d==="")return;a("[name='"+d+"']").each(function(e,d){a(d).parents(".wijmo-wijradio").find("."+b._radiobuttonPre+"-box").children().removeClass("ui-icon-radio-on ui-icon-radio-off").addClass("ui-icon-radio-on");a(d).parents(".wijmo-wijradio").find("."+b._radiobuttonPre+"-box").removeClass("ui-state-active").addClass("ui-state-default").attr("aria-checked",false);a(d).parents(".wijmo-wijradio").removeClass("ui-state-checked");c=a(d).parents(".wijmo-wijradio").find(":radio");c.wijradio("option","checked")&&c[0]!==b.element[0]&&c.wijradio("setCheckedOption",false)});if(b.element.is(":checked")){b.element.data("iconElement").removeClass("ui-icon-radio-on").addClass("ui-icon-radio-off");b.element.data("boxElement").removeClass("ui-state-default").addClass("ui-state-active").attr("aria-checked",true);b.element.data("radiobuttonElement").addClass("ui-state-checked")}b.options.checked=b.element.is(":checked")},setCheckedOption:function(a){var c=this,b=c.options;if(b.checked!==null&&b.checked!==a){b.checked=a;c._trigger("changed",null,{checked:a})}},refresh:function(){this._refresh()},destroy:function(){var b=this,c=b.element.parent().parent();c.children("div."+b._radiobuttonPre+"-box").remove();b.element.unwrap();b.element.unwrap();a.Widget.prototype.destroy.apply(b)}})})(jQuery);
(function(a){"use strict";var g="ui-widget ui-widget-content ui-corner-all wijmo-wijlist",c="wijmo-wijlist-item",h=c+"-alternate",i=c+"-selected",j=c+"-first",k=c+"-last",f="ui-state-hover",l="ui-state-active",e="wijmo-wijlistitem-active",b=i+" "+l,d="item.wijlist";a.widget("wijmo.wijlist",{options:{listItems:[],selected:null,selectionMode:"single",autoSize:false,maxItemsCount:5,addHoverItemClass:true,superPanelOptions:null,disabled:false,focusing:null,focus:null,blur:null,itemRendering:null,itemRendered:null,listRendered:null,keepHightlightOnMouseLeave:false},removeAll:function(){var a=this;a.items=[];a._refresh()},addItem:function(c,b){var a=this;a._checkData();if(b===null||b===undefined)a.items.push(c);else a.items&&a.items.splice(b,0,c);a._refresh()},removeItem:function(c){var b=this,a;b._checkData();a=b.indexOf(c);a>=0&&b.removeItemAt(a)},indexOf:function(e){var c=this,d=-1,a=0,b;c._checkData();for(a=0;a<c.items.length;a++){b=c.items[a];if(b.label===e.label&&b.value===e.value){d=a;break}}return d},removeItemAt:function(b){var a=this;a._checkData();a.items.splice(b,1);a._refresh()},_checkData:function(){var a=this;if(!a.items)a.items=[]},_refresh:function(){var a=this;a.renderList();a.refreshSuperPanel()},_setOption:function(e,f){var c=this,d;a.Widget.prototype._setOption.apply(c,arguments);if(e==="disabled")c._handleDisabledOption(f,c.element);else if(e==="selectionMode"){d=c.selectedItem;if(d){d.selected=false;d.element&&d.element.removeClass(b);c.selectedItem=undefined}a.each(c.selectedItems,function(c,a){a.selected=false;a.element.removeClass(b)});c.selectedItem=[]}else if(e==="listItems"){c.setItems(f);c.renderList();c.refreshSuperPanel()}else(e==="autoSize"||e==="maxItemsCount")&&c.refreshSuperPanel()},_create:function(){var b=this,c=this.element,d=this.options;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);c.addClass(g).attr({role:"listbox","aria-activedescendant":e,"aria-multiselectable":d.selectionMode==="multiple"}).bind("click."+b.widgetName,b,b._onListClick);if(c.is("div")&&c.children().is("ul")){b._isInnerData=true;b._templates=[];a.each(a("ul > li",c),function(c,a){b._templates.push({templateHtml:a.innerHTML})});b._oriChildren=c.children().hide()}b.ul=a("<ul class='wijmo-wijlist-ul'></ul>").appendTo(c);if(d.listItems!==null)if(d.listItems.length>0){b.setItems(d.listItems);b.renderList();b.refreshSuperPanel()}b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b.refreshSuperPanel();b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijlist");d.disabled&&b.disable()},_handleDisabledOption:function(b,c){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv(c);a.disabledDiv.appendTo("body")}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(f){var g=this,b=f||g.element,c=b.offset(),e=b.outerWidth(),d=b.outerHeight();return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:e,height:d,left:c.left,top:c.top})},setTemplateItems:function(a){this._setItemsByExtend(a,true)},setItems:function(a){this._setItemsByExtend(a,false)},_setItemsByExtend:function(c,e){var b=this,d;if(e){if(b._templates&&c&&c.length!==b._templates.length)return;b.items=c;if(!b.items)b.items=[];a.each(b._templates,function(a){if(b.items[a])b.items[a].templateHtml=b._templates[a].templateHtml;else b.items.push({templateHtml:b._templates[a].templateHtml,label:c[a].label,value:c[a].value})})}else b.items=c;if(!c)return null;d=a.grep(c,function(a){return a.selected});if(b.options.selectionMode==="single"){b.selectedItems=[];b.selectedItem=d.length>0?d[0]:undefined}else b.selectedItems=d},filterTemplateItems:function(f){var e=this,c=e._escapeRegex(f),d,b=null;if(!this.items)return null;d=new RegExp(c,"i");a.each(this.items,function(g,a){var f=d.exec(a.label);if(f===null)a.element.hide();else{a.selected&&e.activate(null,a,false);!a.element.is("visible")&&a.element.show();if(c!==undefined&&c.length!==0&&b===null&&f.index===0)b=a}});return b},popItem:function(){var a=this;a._checkData();a.items.pop();a._refresh()},getList:function(){return this.ul},_onListClick:function(b){if(!a(b.target).closest(".wijmo-wijlist-item").length)return;var c=b.data;c.select(b)},destroy:function(){var b=this,c=this.element;b.superPanel!==undefined&&b.superPanel.destroy();c.removeClass("wijmo-wijobserver-visibility").removeClass(g).removeAttr("role").removeAttr("aria-activedescendant").unbind("."+b.widgetName);b.ul.remove();if(b.disabledDiv){b.disabledDiv.remove();b.disabledDiv=null}b._isInnerData&&b._oriChildren.show();a.Widget.prototype.destroy.apply(b,arguments)},activate:function(d,b,g){var a=this,h,c;a.deactivate();if(b===null||b===undefined)return;if(a._trigger("focusing",d,b)===false)return;h=a.active=b;c=b.element;if(c){a.options.addHoverItemClass&&c.addClass(f);c.attr("id",e)}g&&a.superPanel!==undefined&&a.superPanel.scrollChildIntoView(c);a._trigger("focus",d,b)},deactivate:function(){var a=this,c=a.active,b;if(!c)return;b=c.element;a._trigger("blur",null,c);b&&b.removeClass(f).removeAttr("id");a.active=undefined},next:function(a){this.move("next","."+c+":first",a)},nextPage:function(){this.superPanel.doScrolling("bottom",true)},previous:function(a){this.move("prev","."+c+":last",a)},previousPage:function(){this.superPanel.doScrolling("top",true)},first:function(){return this.active&&!this.active.element.prev().length},last:function(){return this.active&&!this.active.element.next().length},move:function(f,g,e){var a=this,h,b;if(!a.active){h=a.ul.children(g).data(d);a.activate(e,h,true);return}if(!a._templates)b=a.active.element[f+"All"]("."+c).eq(0);else b=a.active.element[f+"All"](":visible."+c).eq(0);if(b.length)a.activate(e,b.data(d),true);else a.activate(e,a.element.children(g).data(d),true)},select:function(j,k){var e=this,g,h,c,i,f;if(e.active===undefined)return;g=e.active.element;if(g===undefined)return;c=g.data(d);if(!c)return;i=e.options.selectionMode==="single";if(i){f=e.selectedItem;g.addClass(b).attr("aria-selected","true");c.selected=true;if(f!==undefined&&c!==f){f.selected=false;f.element&&f.element.removeClass(b).removeAttr("aria-selected")}e.selectedItem=c;h=a.inArray(c,e.items);e._trigger("selected",j,{item:c,previousItem:f,selectedIndex:h,data:k})}else{c.selected=!c.selected;if(c.selected)g.addClass(b).attr("aria-selected","true");else g.removeClass(b).removeAttr("aria-selected","true");e.selectedItems=a.grep(e.items,function(a){return a.selected});e._trigger("selected",j,{item:c,selectedItems:e.selectedItems})}},_findItemsByValues:function(c){var b,d=[];d=a.grep(this.items,function(d){b=false;for(var a=0;a<c.length;a++)if(d.value===c[a])b=true;return b});return d},_findItemsByIndices:function(c){var d=this,e=this.items.length,b=[];a.each(c,function(c,a){a>=0&&a<e&&b.push(d.items[a])});return b},getItems:function(b){var g=this,f,c,d,e;c=a.isArray(b);f=!c&&!isNaN(b)||c&&!isNaN(b[0]);d=c?b:[b];e=f?g._findItemsByIndices(d):g._findItemsByValues(d);return e},selectItems:function(i,g){var c=this,h=this.options.selectionMode==="single",e,d,f;f=c.getItems(i);if(h){if(f.length>0){e=f[0];e.selected=true;e.element.addClass(b)}d=c.selectedItem;if(d){d.selected=false;d.element.removeClass(b)}c.selectedItem=e;g&&c._trigger("selected",null,{item:e,previousItem:d})}else{a.each(f,function(c,a){a.selected=true;a.element.addClass(b)});c.selectedItems=a.grep(c.items,function(a){return a.selected});g&&c._trigger("selected",null,{selectedItems:c.selectedItems})}},unselectItems:function(f){var c=this,g=this.options.selectionMode,d,e;if(g==="single"){d=c.selectedItem;if(d){d.selected=false;d.element.removeClass(b);c.selectedItem=undefined}}else{e=c.getItems(f);a.each(e,function(c,a){a.selected=false;a.element.removeClass(b)});c.selectedItems=a.grep(c.items,function(a){return a.selected})}},renderList:function(){var d=this,g=this.ul,h=this.options,a,b,e,c,f;g.empty();a=d.items;if(a===undefined)return;b=a.length;if(a===undefined||a===null&&b===0)return;e=h.selectionMode==="single";for(c=0;c<b;c++){f=a[c];d._renderItem(g,f,c,e)}if(b>0){a[0].element&&a[0].element.addClass(j);a[b-1].element&&a[b-1].element.addClass(k)}d._trigger("listRendered",null,d)},_renderItem:function(k,c,j){var e=this,f=a("<li role='option' class='wijmo-wijlist-item ui-corner-all'></li>"),g,i;c.element=f;c.list=e;if(e._trigger("itemRendering",null,c)===false)return;g=c.label;if(c.templateHtml)g=c.templateHtml;else if(c.text!==undefined)g=c.text;f.bind("mouseover",function(a){e.activate(a,c,false)}).bind("mouseout",function(){!e.options.keepHightlightOnMouseLeave&&e.deactivate()}).data(d,c).append(g).appendTo(k);if(!e._isInnerData){i=c.imageUrl;i!==undefined&&i.length>0&&f.prepend("<img src='"+c.imageUrl+"'>")}if(c.selected){e.activate(null,c,false);f.addClass(b)}j%2===1&&f.addClass(h);e._trigger("itemRendered",null,c)},_escapeRegex:function(a){return a===undefined?a:a.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")},adjustOptions:function(){var b=this.options,a;if(b.data!==null)for(a=0;a<b.listItems.length;a++){delete b.listItems[a].element;delete b.listItems[a].list}return b},refreshSuperPanel:function(){var b=this,d=this.element,m=this.options,c=this.ul,o=c.children(".wijmo-wijlist-item:first"),n,h=null,g,j,k,e,f,i,l;if(!d.is(":visible"))return false;if(m.autoSize)h=o.outerHeight(true)*m.maxItemsCount;h!==null&&d.height(Math.min(h,c.outerHeight()));g=d.innerHeight();j=g/(c.outerHeight()-g);f=101*j/(1+j);k=o.outerHeight()/(c.outerHeight()-g)*(101-f);if(b.superPanel===undefined){i={allowResize:false,keyboardSupport:false,bubbleScrollingEvent:true,hScroller:{scrollBarVisibility:"hidden"},vScroller:{scrollSmallChange:k,scrollLargeChange:f}};a.extend(i,m.superPanelOptions);b.superPanel=d.wijsuperpanel(i).data("wijsuperpanel");if(b.superPanel.vNeedScrollBar){c.setOutWidth(d.innerWidth()-18);b.superPanel.refresh()}}else{e=b.superPanel.options.vScroller;e.scrollLargeChange=f;e.scrollSmallChange=k;b.superPanel.paintPanel();if(b.superPanel.vNeedScrollBar){c.setOutWidth(d.innerWidth()-18);b.superPanel.refresh()}else{c.setOutWidth(d.outerWidth());n=d.children(".wijmo-wijsuperpanel-header").outerHeight();d.height(c.outerHeight()+n);b.superPanel.refresh()}}l=c.css("padding-top");if(l.length>0){e=b.superPanel.options.vScroller;e.firstStepChangeFix=b.superPanel.scrollPxToValue(parseFloat(l),"v")}else e.firstStepChangeFix=0;c.setOutWidth(c.parent().parent().innerWidth())}})})(jQuery);
(function(a){"use strict";var c={general:0,weekEnd:1,otherMonth:2,outOfRange:4,today:8,custom:16,disabled:32,selected:64,gap:128};a.widget("wijmo.wijcalendar",{options:{culture:"",monthCols:1,monthRows:1,titleFormat:"MMMM yyyy",showTitle:true,displayDate:undefined,dayRows:6,dayCols:7,weekDayFormat:"short",showWeekDays:true,showWeekNumbers:false,calendarWeekRule:"firstDay",minDate:new Date(1900,0,1),maxDate:new Date(2099,11,31),showOtherMonthDays:true,showDayPadding:false,selectionMode:{day:true,days:true},allowPreview:false,allowQuickPick:true,toolTipFormat:"dddd, MMMM dd, yyyy",prevTooltip:"Previous",nextTooltip:"Next",quickPrevTooltip:"Quick Previous",quickNextTooltip:"Quick Next",prevPreviewTooltip:"",nextPreviewTooltip:"",navButtons:"default",quickNavStep:12,direction:"horizontal",duration:250,easing:"easeInQuad",popupMode:false,autoHide:true,customizeDate:null,title:null,beforeSlide:null,afterSlide:null,beforeSelect:null,afterSelect:null,selectedDatesChanged:null},_create:function(){var b=this;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);a.isFunction(window.wijmoASPNetParseOptions)&&wijmoASPNetParseOptions(this.options);this.element.addClass("wijmo-wijcalendar ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").attr("role","grid");this._previewWrapper(this.options.allowPreview);this.element.data("preview.wijcalendar",false);b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b.refresh();b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijcalendar")},_init:function(){if(this.options.popupMode){var a={autoHide:!!this.options.autoHide},b=this;if(this.options.beforePopup)a.showing=this.options.beforePopup;if(this.options.afterPopup)a.shown=this.options.afterPopup;if(this.options.beforeClose)a.hiding=this.options.beforeClose;a.hidden=function(a){b.element.removeData("lastdate.wijcalendar");b.options.afterClose&&b.options.afterClose.call(a)};this.element.wijpopup(a)}this._getSelectedDates();this._getDisabledDates();this._resetWidth();this.refresh();this.element.width(this.element.width()+2)},destroy:function(){a.Widget.prototype.destroy.apply(this,arguments);this.close();this.element.html("");this.element.removeClass("wijmo-wijcalendar ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-datepicker-multi").removeAttr("role");var b=this;a.each(["preview","disableddates","selecteddates","dragging","lastdate","animating"],function(c,a){b.element.removeData(a+".wijcalendar")});this._previewWrapper(false)},_setOption:function(c,b){a.Widget.prototype._setOption.apply(this,arguments);switch(c){case"showWeekDays":case"showWeekNumbers":case"showTitle":case"showOtherMonthDays":case"selectionMode":this.unSelectAll();this._resetWidth();this.refresh();break;case"culture":this.refresh();break;case"allowPreview":this._previewWrapper(b);this.refresh();break;case"monthCols":this._resetWidth();this.refresh();break;case"autoHide":this.element.wijpopup({autoHide:this.options.autoHide});break;case"selectedDates":this._getSelectedDates().setDates(b);this.refresh();break;case"disabledDates":this._getDisabledDates().setDates(b);this.refresh();break;case"displayDate":this.refresh()}},_previewWrapper:function(a){if(a)!this.element.parent().hasClass("wijmo-wijcalendar-preview-wrapper")&&this.element.wrap("<div class='wijmo-wijcalendar-preview-wrapper ui-helper-clearfix'></div>");else this.element.parent().hasClass("wijmo-wijcalendar-preview-wrapper")&&this.element.unwrap()},_isRTL:function(){return!!this._getCulture().isRTL},refresh:function(){this.element.empty().append(this._createCalendar());this.element[(this._isRTL()?"add":"remove")+"Class"]("ui-datepicker-rtl");this._bindEvents()},refreshDate:function(b){if(!this._monthViews)return;if(b<this._groupStartDate||b>this._groupEndDate)return;a.each(this._monthViews,function(){this._refreshDate(b)})},getDisplayDate:function(){var a=this.options.displayDate?this.options.displayDate:new Date;if(b.isSameDate(a,new Date(1900,0,1)))a=new Date;return a},getSelectedDate:function(){var a=this.options.selectedDates;return!a||a.length===0?null:a[0]},selectDate:function(a){a=new Date(a);if(this._getDisabledDates().contains(a))return false;if(a<this.options.minDate||a>this.options.maxDate)return false;this._getSelectedDates().add(a);this.refreshDate(a);return true},unSelectDate:function(a){a=new Date(a);if(this._getDisabledDates().contains(a))return false;if(a<this.options.minDate||a>this.options.maxDate)return false;this._getSelectedDates().remove(a);this.refreshDate(a);return true},unSelectAll:function(){var a=this.options.selectedDates,b;if(a&&a.length>0){this._getSelectedDates().clear();for(b=0;b<a.length;b++)this.refreshDate(a[b])}},_slideToDate:function(a){if(b.isSameMonth(this.getDisplayDate(),a))return;var c=this.element.is(":visible");if(!c)this.options.displayDate=a;else{if(this._trigger("beforeSlide")===false)return;if(this._isSingleMonth())this._playSlideAnimation(a);else this._playMmSlideAnimation(a)}},isPopupShowing:function(){return!!this.options.popupMode?this.element.wijpopup("isVisible"):false},popup:function(a){this._myGrid=undefined;this.refresh();this.element.data("dragging.wijcalendar",false);this.element.wijpopup("show",a)},popupAt:function(a,b){this._myGrid=undefined;this.refresh();this.element.data("dragging.wijcalendar",false);this.element.wijpopup("showAt",a,b)},close:function(){this.isPopupShowing()&&this.element.wijpopup("hide")},_getCulture:function(a){return Globalize.findClosestCulture(a||this.options.culture)},_getDates:function(b){var c=b.toLowerCase()+".wijcalendar",a=this.element.data(c);if(a===undefined){a=new f(this,b);this.element.data(c,a)}return a},_getDisabledDates:function(){return this._getDates("disabledDates")},_getSelectedDates:function(){return this._getDates("selectedDates")},_onDayDragStart:function(a){a.preventDefault();a.stopPropagation();return false},_onDayMouseDown:function(c){c.preventDefault();c.stopPropagation();var d=this.options,j=this,b,g,e=false,f=d.selectedDates,i=false,h=[];if(c.which!==1)return false;b=this._getCellDate(c.currentTarget);if(b===undefined)return false;if(!d.selectionMode.day)return false;g={date:b};if(this._trigger("beforeSelect",null,g)===false)return false;(!d.selectionMode.days||!c.metaKey&&!c.shiftKey&&!c.ctrlKey)&&this.unSelectAll();if(!!d.selectionMode.days)if(c.shiftKey&&this.element.data("lastdate.wijcalendar")){this._selectRange(this.element.data("lastdate.wijcalendar"),b);e=true}else if(c.ctrlKey){this.element.data("lastdate.wijcalendar",b);a.each(f,function(c,a){if(b.getFullYear()===a.getFullYear()&&b.getMonth()===a.getMonth()&&b.getDate()===a.getDate()){i=true;return false}});if(i)this.unSelectDate(b);else this.selectDate(b);f=d.selectedDates;a.each(f,function(b,a){h.push(new Date(a))});this._trigger("selectedDatesChanged",null,{dates:h});e=true}if(!e){this.element.data("lastdate.wijcalendar",b);e=this.selectDate(b);this._trigger("selectedDatesChanged",null,{dates:[b]})}if(e){this._trigger("afterSelect",null,g);if(!!d.selectionMode.days){this.element.data("dragging.wijcalendar",true);a(document.body).bind("mouseup."+this.widgetName,function(){a(document.body).unbind("mouseup."+j.widgetName);j.element.data("dragging.wijcalendar",false)})}}return false},_onMouseUp:function(a){a.preventDefault();a.stopPropagation();this.element.data("dragging.wijcalendar",false);return false},_onDayClicked:function(c){var b=this._getCellDate(c.currentTarget);if(b===undefined)return false;if(!this.options.selectionMode.day)return false;if(this.isPopupShowing())this.close();else a(c.currentTarget).hasClass("ui-datepicker-other-month")&&this._slideToDate(b);return false},_onDayMouseEnter:function(b){a(b.currentTarget).attr("state","hover");this._refreshDayCell(b.currentTarget);if(!!this.element.data("dragging.wijcalendar")){var c=this._getCellDate(b.currentTarget);if(c===undefined)return;this.unSelectAll();this._selectRange(this.element.data("lastdate.wijcalendar"),c,true)}},_onDayMouseLeave:function(b){a(b.currentTarget).attr("state","normal");this._refreshDayCell(b.currentTarget)},_selectRange:function(a,e,g){if(a!==undefined&&a!==new Date(1900,1,1)){var c=a,f=e,d=[];if(a>e){f=a;c=e}for(;;){if(c>f)break;this.selectDate(c);d[d.length]=c;c=b.addDays(c,1)}!g&&this.element.removeData("lastdate.wijcalendar");this._trigger("selectedDatesChanged",null,{dates:d})}else{this.selectDate(a);this._trigger("selectedDatesChanged",null,{dates:[a]})}return true},_getCellDate:function(c){var b=a(c).attr("date");return b===undefined?b:new Date(b)},_getParentTable:function(c){var b=a(c).parents("table");return b.length===0?undefined:b.get(0)},_initMonthSelector:function(e){if(a(e).data("cells")!==undefined)return;var d=e.id.split("_"),k,b,h=[],f,g,c,j,i;if(d[d.length-1]!=="ms")throw Error.create("not a monthview");k=d.slice(0,d.length-1).join("_");b=this._getParentTable(e);if(b){if(b.id!==k)throw Error.create("not a monthview");for(f=0;f<b.rows.length;f++){i=b.rows[f];for(g=0;g<i.cells.length;g++){c=i.cells[g];if(c){j=a(c).attr("daytype");if(j!==undefined)if(a(c).find("a").hasClass("ui-priority-secondary")===false)if(this._isSelectable(parseInt(j,10)))h[h.length]=c}}}}a(e).data("cells",h)},_onMonthSelectorClicked:function(h){this._initMonthSelector(h.currentTarget);var f=a(h.currentTarget).data("cells"),c=[],b,g,e,d;this.element.removeData("lastdate.wijcalendar");this.unSelectAll();for(b=0;b<f.length;b++){g=f[b];e=a(g).attr("date");if(e!==undefined){d=new Date(e);this.selectDate(d);c[c.length]=d}}this._trigger("selectedDatesChanged",null,{dates:c});this.isPopupShowing()&&this.close();return false},_onMonthSelectorMouseEnter:function(b){this._initMonthSelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseEnter(b)}},_onMonthSelectorMouseLeave:function(b){this._initMonthSelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseLeave(b)}},_initWeekDaySelector:function(f){if(a(f).data("cells")!==undefined)return;var b=f.id.split("_"),g,k,c,h=[],e=0,j,d,i;if(b[b.length-2]!=="cs")throw Error.create("not a column");g=parseInt(b[b.length-1],10);k=b.slice(0,b.length-2).join("_");c=this._getParentTable(f);if(c){if(c.id!==k)throw Error.create("not a column");if(!this._isSingleMonth())e++;if(this.options.showWeekDays)e++;for(;e<c.rows.length;e++){j=c.rows[e];if(g<j.cells.length){d=j.cells[g];if(d){i=a(d).attr("daytype");if(i!==undefined)if(a(d).find("a").hasClass("ui-priority-secondary")===false)if(this._isSelectable(parseInt(i,10)))h[h.length]=d}}}}a(f).data("cells",h)},_onWeekDayClicked:function(h){this._initWeekDaySelector(h.currentTarget);var f=a(h.currentTarget).data("cells"),c=[],b,g,e,d;this.unSelectAll();for(b=0;b<f.length;b++){g=a(f[b]);e=g.attr("date");if(e!==undefined){d=new Date(e);this.selectDate(d);c[c.length]=d}}this._trigger("selectedDatesChanged",null,{dates:c});this.isPopupShowing()&&this.close();return false},_onWeekDayMouseEnter:function(b){this._initWeekDaySelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseEnter(b)}},_onWeekDayMouseLeave:function(b){this._initWeekDaySelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseLeave(b)}},_initWeekNumberSelector:function(g){if(a(g).data("cells")!==undefined)return;var b=g.id.split("_"),j,k,e,h=[],f,d,c,i;if(b[b.length-2]!=="rs")throw Error.create("not a row");j=parseInt(b[b.length-1],10);k=b.slice(0,b.length-2).join("_");e=this._getParentTable(g);if(e){if(e.id!==k)throw Error.create("not a row");f=e.rows[j];if(f){d=0;if(this.options.showWeekNumbers)d++;for(;d<f.cells.length;d++){c=f.cells[d];if(c){i=a(c).attr("daytype");if(i!==undefined)if(a(c).find("a").hasClass("ui-priority-secondary")===false)if(this._isSelectable(parseInt(i,10)))h[h.length]=c}}}}a(g).data("cells",h)},_onWeekNumberClicked:function(h){this._initWeekNumberSelector(h.currentTarget);var f=a(h.currentTarget).data("cells"),c=[],b,g,e,d;this.unSelectAll();for(b=0;b<f.length;b++){g=a(f[b]);e=g.attr("date");if(e!==undefined){d=new Date(e);this.selectDate(d);c[c.length]=d}}this._trigger("selectedDatesChanged",null,{dates:c});this.isPopupShowing()&&this.close();return false},_onWeekNumberMouseEnter:function(b){this._initWeekNumberSelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseEnter(b)}},_onWeekNumberMouseLeave:function(b){this._initWeekNumberSelector(b.currentTarget);for(var d=a(b.currentTarget).data("cells"),c=0;c<d.length;c++){b.currentTarget=d[c];this._onDayMouseLeave(b)}},_isAnimating:function(){return!!this.element.data("animating.wijcalendar")},_onPreviewMouseEnter:function(h){if(!!this.element.data("previewContainer"))return;if(this._isAnimating())return;var g=a(h.currentTarget),d=g.attr("id"),f=this.getDisplayDate(),e=this.options.monthCols*this.options.monthRows,c=a("<div/>");if(d===undefined)return;if(d==="prevPreview")e=-e;this.options.displayDate=b.addMonths(f,e);this.element.data("preview.wijcalendar",true);c.appendTo(document.body);c.hide();c.addClass("wijmo-wijcalendar ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all");c.append(this._createCalendar());this.options.displayDate=f;this.element.data("preview.wijcalendar",false);this._createMonthViews();c.wijpopup({showEffect:"slide",showOptions:{direction:d==="prevPreview"?"right":"left"},hideEffect:"slide",hideOptions:{direction:d==="prevPreview"?"right":"left"}});c.wijpopup("show",{my:d==="prevPreview"?"right top":"left top",at:d==="prevPreview"?"left top":"right top",of:g});this.element.data("previewContainer",c)},_onPreviewMouseLeave:function(c){var f=a(c.currentTarget),d=f.attr("id"),b=this.element.data("previewContainer"),e=this;if(d===undefined)return;if(b)if(b.wijpopup("isAnimating"))window.setTimeout(function(){e._onPreviewMouseLeave(c)},200);else{b.wijpopup("hide");this.element.removeData("previewContainer")}},_resetWidth:function(){if(!this._myGrid){this.element.css("height","");if(this.options.monthCols>1){this.element.css("width",17*this.options.monthCols+"em");this.element.addClass("ui-datepicker-multi")}else{this.element.css("width","");this.element.removeClass("ui-datepicker-multi")}}},_playMmSlideAnimation:function(f){var i=this.element.width(),g=this.element.height(),h=this.getDisplayDate(),c,a,b,e=this.options.direction||"horizontal",d=this;this.element.height(g);this.element.wrapInner("<div class='wijmo-wijcalendar-multi-aniwrapper'></div>");c=this.element.find(">:first-child").width(i).height(g);a=c.clone(false);a.hide();this.options.displayDate=f;this._createMonthViews();a.empty().append(this._createMonthGroup());a.appendTo(this.element);b=f>h;this.element.data("animating.wijcalendar",true);c.effect("slide",{mode:"hide",direction:e==="horizontal"?b?"left":"right":b?"up":"down",easing:this.options.easing||"easeOutBack",duration:this.options.duration},function(){c.remove()});a.effect("slide",{direction:e==="horizontal"?b?"right":"left":b?"down":"up",easing:this.options.easing||"easeOutBack",duration:this.options.duration},function(){while(a.parent().is(".wijmo-wijcalendar-multi-aniwrapper"))a.parent().replaceWith(a);a.replaceWith(a.contents());d.element.height("");d._bindEvents();d.element.data("animating.wijcalendar",false);d._trigger("afterSlide")})},_playSlideAnimation:function(m){if(!this._isSingleMonth())return;var f=this,n=this.getDisplayDate(),c=this.element.find(".ui-datepicker-calendar"),b,k,l=1,j=this.options.direction||"horizontal",h=m>n,d=[],g,i;if(c.parent().is(".wijmo-wijcalendar-aniwrapper"))b=c.parent();else{b=a.effects.createWrapper(c).css({overflow:"hidden"});b.removeClass("ui-effects-wrapper");b.addClass("wijmo-wijcalendar-aniwrapper")}if(b.parent().is(".wijmo-wijcalendar-aniwrapper"))k=b.parent();else{k=a.effects.createWrapper(b).css({overflow:"hidden"});k.removeClass("ui-effects-wrapper");k.addClass("wijmo-wijcalendar-aniwrapper")}if(this._myGrid)switch(this._myGrid.gridType){case"month":l=1;break;case"year":l=10;break;case"decade":l=100}d[d.length]=m;g=c.outerWidth();i=c.outerHeight();if(j==="horizontal"){c.width(g).css("float",h?"left":"right");b.width((d.length+1)*g);b.css("left",h?0:-d.length*g).css("position","absolute")}else{b.width(g);b.css("top",h?0:-d.length*i).css("position","absolute");b.height((d.length+1)*i)}a.each(d,function(l,c){if(f._myGrid===undefined){var k=new e(f,c),d=f._customize(k.getHtml(true));if(j==="horizontal")d.width(g).css("float",h?"left":"right").appendTo(b);else d.appendTo(b)}else if(j==="horizontal")a(f._myGrid.getHtml(c,true)).width(g).height(i).css("float",h?"left":"right").appendTo(b);else a(f._myGrid.getHtml(c,true)).height(i).appendTo(b)});this.options.displayDate=m;this._myGrid===undefined&&this._createMonthViews();this._refreshTitle();this.element.data("animating.wijcalendar",true);b.effect("slide",{mode:"hide",direction:j==="horizontal"?h?"left":"right":h?"up":"down",easing:this.options.easing||"easeOutBack",distance:(j==="horizontal"?g:i)*d.length,duration:this.options.duration},function(){c=b.children(":last");while(c.parent().is(".wijmo-wijcalendar-aniwrapper"))c.parent().replaceWith(c);c.css({"float":"",width:""});f._bindEvents();f.element.data("animating.wijcalendar",false);f._trigger("afterSlide")})},_onTitleClicked:function(){if(!this.options.allowQuickPick||!this._isSingleMonth())return;if(this._isAnimating())return;if(this._myGrid===undefined)this._myGrid=new g(this);else switch(this._myGrid.gridType){case"month":this._myGrid.gridType="year";break;case"year":this._myGrid.gridType="decade";break;case"decade":return}this._refreshTitle();this.element.width(this.element.width()).height(this.element.height());var d=this.element.find(".ui-datepicker-calendar"),b,e,c,o=d.outerWidth(),k=d.outerHeight(),f,j,n,i,h,m,l=this;if(d.parent().is(".wijmo-wijcalendar-aniwrapper"))b=d.parent();else b=a.effects.createWrapper(d).css({overflow:"hidden"}).removeClass("ui-effects-wrapper").addClass("wijmo-wijcalendar-aniwrapper");if(b.parent().is(".wijmo-wijcalendar-aniwrapper"))e=b.parent();else e=a.effects.createWrapper(b).css({overflow:"hidden"}).removeClass("ui-effects-wrapper").addClass("wijmo-wijcalendar-aniwrapper").width(o).height(k);c=a(this._myGrid.getHtml(true)).css({position:"absolute",top:0,left:0,opacity:0}).appendTo(e).height(k);f=this._myGrid.getSelectedIndex();j=Math.floor(f/4);n=f-j*4;i=o/4;h=k/3;m={left:i*n,top:h*j,width:i,height:h};d.width("100%").height("100%");b.css({border:"solid 1px #cccccc"});this.element.data("animating.wijcalendar",true);b.effect("size",{to:m,duration:this.options.duration||500},function(){b.remove()});c.animate({opacity:1},this.options.duration||500,function(){c.css({position:"",top:"",left:"",filter:""});while(c.parent().is(".wijmo-wijcalendar-aniwrapper"))c.parent().replaceWith(c);l._bindEvents();l.element.data("animating.wijcalendar",false)})},_onMyGridClicked:function(p){if(this._myGrid===undefined)return false;if(this._isAnimating())return false;var c=a(p.currentTarget),i=parseInt(c.attr("index"),10),o=parseInt(c.attr("value"),10),b=this.element.find(".ui-datepicker-calendar"),k,g,j,f,l,h,m,n,d,e=this;if(this._myGrid.gridType!=="month")if(!i||i===11)return false;!c.hasClass("ui-state-active")&&this._myGrid.select(i,o);if(this._myGrid.gridType==="decade")this._myGrid.gridType="year";else if(this._myGrid.gridType==="year")this._myGrid.gridType="month";else this._myGrid=undefined;this._refreshTitle();j=b.outerWidth();f=b.outerHeight();if(b.parent().is(".wijmo-wijcalendar-aniwrapper"))g=b.parent();else g=a.effects.createWrapper(b).css({overflow:"hidden"}).removeClass("ui-effects-wrapper").addClass("wijmo-wijcalendar-aniwrapper").width(j).height(f);l=a.extend({},c.position(),{width:c.width(),height:c.height()});if(this._myGrid===undefined){this._createMonthViews();m=this.getDisplayDate();n=this._getMonthView(m);h=this._customize(n.getHtml(true))}else h=a(this._myGrid.getHtml(true));d=h.height(f).appendTo(g);k=a.effects.createWrapper(d).css({overflow:"hidden"}).removeClass("ui-effects-wrapper").addClass("wijmo-wijcalendar-aniwrapper").css(a.extend(l,{border:"solid 1px #cccccc",position:"absolute"}));this.element.data("animating.wijcalendar",true);k.animate({left:0,top:0,width:j,height:f},this.options.duration||500,function(){});b.animate({opacity:0},this.options.duration||500,function(){b.remove();while(d.parent().is(".wijmo-wijcalendar-aniwrapper"))d.parent().replaceWith(d);e._myGrid===undefined&&e.element.width("").height("");e._bindEvents();e.element.data("animating.wijcalendar",false)});return false},_onMyGridMouseEnter:function(d){if(this._myGrid===undefined)return;var c=a(d.currentTarget),b=parseInt(c.attr("index"),10);if(this._myGrid.gridType!=="month"&&(b<0||b>11))return;c.addClass("ui-state-hover")},_onMyGridMouseLeave:function(d){if(this._myGrid===undefined)return;var c=a(d.currentTarget),b=parseInt(c.attr("index"),10);if(this._myGrid.gridType!=="month"&&(b<0||b>11))return;c.removeClass("ui-state-hover")},_bindEvents:function(){if(!this.element.data("preview.wijcalendar")&&!this.options.disabledState){this.element.find("div .wijmo-wijcalendar-navbutton").unbind().bind("mouseout.wijcalendar",function(){var b=a(this);b.removeClass("ui-state-hover");if(b.hasClass("ui-datepicker-next-hover"))b.removeClass("ui-datepicker-next-hover");else b.hasClass("ui-datepicker-prev-hover")&&b.removeClass("ui-datepicker-prev-hover")}).bind("mouseover.wijcalendar",function(){var b=a(this);b.addClass("ui-state-hover");if(b.hasClass("ui-datepicker-next"))b.addClass("ui-datepicker-next-hover");else b.hasClass("ui-datepicker-prev")&&b.addClass("ui-datepicker-prev-hover")}).bind("click.wijcalendar",a.proxy(this._onNavButtonClicked,this));this.element.unbind(".wijcalendar").bind({"mouseup.wijcalendar":a.proxy(this._onMouseUp,this)});this.element.find(".ui-datepicker-title").unbind().bind("mouseout.wijcalendar",function(){a(this).removeClass("ui-state-hover")}).bind("mouseover.wijcalendar",function(){a(this).addClass("ui-state-hover")}).bind("click.wijcalendar",a.proxy(this._onTitleClicked,this));this.element.find(".wijmo-wijcalendar-prevpreview-button, .wijmo-wijcalendar-nextpreview-button").unbind("mouseenter.wijcalendar").unbind("mouseleave.wijcalendar").bind({"mouseenter.wijcalendar":a.proxy(this._onPreviewMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onPreviewMouseLeave,this)});if(this._myGrid===undefined){this.element.find(".wijmo-wijcalendar-day-selectable").unbind().bind({"click.wijcalendar":a.proxy(this._onDayClicked,this),"mouseenter.wijcalendar":a.proxy(this._onDayMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onDayMouseLeave,this),"mousedown.wijcalendar":a.proxy(this._onDayMouseDown,this),"dragstart.wijcalendar":a.proxy(this._onDayDragStart,this)});!!this.options.selectionMode.month&&this.element.find(".wijmo-wijcalendar-monthselector").unbind().bind({"click.wijcalendar":a.proxy(this._onMonthSelectorClicked,this),"mouseenter.wijcalendar":a.proxy(this._onMonthSelectorMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onMonthSelectorMouseLeave,this)});!!this.options.selectionMode.weekDay&&this.element.find(".ui-datepicker-week-day").unbind().bind({"click.wijcalendar":a.proxy(this._onWeekDayClicked,this),"mouseenter.wijcalendar":a.proxy(this._onWeekDayMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onWeekDayMouseLeave,this)});!!this.options.selectionMode.weekNumber&&this.element.find(".wijmo-wijcalendar-week-num").unbind().bind({"click.wijcalendar":a.proxy(this._onWeekNumberClicked,this),"mouseenter.wijcalendar":a.proxy(this._onWeekNumberMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onWeekNumberMouseLeave,this)})}else this.element.find(".wijmo-wijcalendar-day-selectable").unbind().bind({"click.wijcalendar":a.proxy(this._onMyGridClicked,this),"mouseenter.wijcalendar":a.proxy(this._onMyGridMouseEnter,this),"mouseleave.wijcalendar":a.proxy(this._onMyGridMouseLeave,this)})}},_isSelectable:function(a){var b=this.options;return b.showOtherMonthDays&&a&c.otherMonth||!(a&(c.outOfRange|c.disabled|c.otherMonth))},_getCellClassName:function(b,h,e){var f=this.options,a="",d="ui-state-default",g=!!f.selectionMode.day||!!f.selectionMode.days;e=e||false;if(!e&&!f.disabledState&&g&&this._isSelectable(b))a+=" wijmo-wijcalendar-day-selectable";if(b&c.weekEnd)a+=" ui-datepicker-week-end";if(b&c.otherMonth){a+=" ui-datepicker-other-month";d+=" ui-priority-secondary"}if(b&c.outOfRange){a+=" wijmo-wijcalendar-outofrangeday";d+=" ui-priority-secondary"}if(b&c.gap)a+=" wijmo-wijcalendar-gap";else{if(b&c.disabled){a+=" ui-datepicker-unselectable";d+=" ui-state-disabled"}if(b&c.today){a+=" ui-datepicker-days-cell-over ui-datepicker-today";d+=" ui-state-highlight"}if(b&c.selected&&(b&(c.outOfRange|c.disabled))===0){a+=" ui-datepicker-current-day";d+=" ui-state-active"}if(b&c.gap)a+=" wijmo-wijcalendar-gap";if(b&c.custom)a+=" wijmo-wijcalendar-customday"}return{cssCell:a,cssText:d}},_onNavButtonClicked:function(g){if(this._isAnimating())return false;var c=1,f=a(g.currentTarget).attr("id"),e=this.getDisplayDate(),d=e;if(this._myGrid===undefined){c=f.indexOf("quick")>=0?this.options.quickNavStep:1;c=f.indexOf("next")>=0?c:-c;c=c*this.options.monthRows*this.options.monthCols;d=b.addMonths(e,c)}else{c=f.indexOf("next")>=0?1:-1;switch(this._myGrid.gridType){case"month":d=b.addYears(e,c);break;case"year":d=b.addYears(e,c*10);break;case"decade":d=b.addYears(e,c*100)}}this._slideToDate(d);return false},_getMonthGroupHtml:function(){var f=this.getDisplayDate(),c,h,a,g,e;if(this._isSingleMonth()){c=this._getMonthView(f);c.showPreview=this.options.allowPreview&&!this.element.data("preview.wijcalendar");return c.getHtml()}h=100/this.options.monthCols+"%";a=new d;for(g=0;g<this.options.monthRows;g++){for(e=0;e<this.options.monthCols;e++){a.writeBeginTag("div");a.writeAttribute("class","ui-datepicker-group"+(e===0?" ui-datepicker-group-first":"")+(e===this.options.monthCols-1?" ui-datepicker-group-last":""));a.writeAttribute("style","width:"+h);a.writeTagRightChar();c=this._getMonthView(f);c.showPreview=false;a.write(c.getHtml());a.writeEndTag("div");f=b.addMonths(f,1)}a.writeBeginTag("div");a.writeAttribute("class","ui-datepicker-row-break");a.writeTagRightChar();a.writeEndTag("div")}return a.toString()},_getCalendarHtml:function(){this._createMonthViews();var a=new d;a.write(this._getMonthGroupHtml());return a.toString()},_customizeDayCell:function(a){a.attr("state")===undefined&&a.attr("state","normal");if(a.attr("daytype")===undefined)return;if(a.attr("date")===undefined)return;var b=parseInt(a.attr("daytype"),10),d=new Date(a.attr("date")),c=a.attr("state")==="hover";this.options.customizeDate(a,d,b,c)},_customize:function(c){var e=this.options,d=this,b=a(c);if(!a.isFunction(e.customizeDate))return b;a.each(b.find(".wijmo-wijcalendar-day-selectable"),function(c,b){d._customizeDayCell(a(b))});return b},_createCalendar:function(){return this._customize(a(this._getCalendarHtml()))},_createMonthGroup:function(){return this._customize(a(this._getMonthGroupHtml()))},_getMonthID:function(a){return a.getFullYear()+"_"+(a.getMonth()+1)},_createMonthViews:function(){this._monthViews={};for(var c="",a=this.getDisplayDate(),f,d,g,h=0;h<this.options.monthRows;h++)for(f=0;f<this.options.monthCols;f++){c=this._getMonthID(a);this._monthViews[c]=new e(this,a);if(h===0){if(f===0)this._monthViews[c].isFirst=true;if(f===this.options.monthCols-1)this._monthViews[c].isLast=true}a=b.addMonths(a,1)}a=this.getDisplayDate();c=this._getMonthID(a);d=this._monthViews[c];if(d)this._groupStartDate=d.getStartDate();g=this.options.monthRows*this.options.monthCols;if(g>1){a=b.addMonths(a,g-1);c=this._getMonthID(a);d=this._monthViews[c]}if(d)this._groupEndDate=d.getEndDate()},_getMonthView:function(b){var a=this._getMonthID(b);return this._monthViews[a]},_getId:function(){return this.element.attr("id")},_getChildElement:function(b){var a=this.element.find("[id*='"+b+"']");return a.length===0?undefined:a},_refreshDayCell:function(h){var b=a(h),i=this.options,d,g,f,e;b.attr("state")===undefined&&b.attr("state","normal");if(b.attr("daytype")===undefined)return;if(b.attr("date")===undefined)return;d=parseInt(b.attr("daytype"),10);g=new Date(b.attr("date"));f=b.attr("state")==="hover";b.attr("class",this._getCellClassName(d,g).cssCell);b.removeAttr("aria-selected");d&c.selected&&b.attr("aria-selected",true);if(a.isFunction(i.customizeDate))if(this._customizeDayCell(b))return;e=b.find("a");if(e.length>0){e.toggleClass("ui-state-hover",f);e.toggleClass("ui-state-active",(d&c.selected)!==0)}},_isSingleMonth:function(){return this.options.monthCols*this.options.monthRows===1},_splitString:function(f,e,b){if(b===undefined)return f.split(e);for(var c=[],d=f.split(e),a=0;a<d.length;a++)if(a>=b)c[b-1]=c[b-1]+e+d[a];else c.push(d[a]);return c},_getNavButtonHtml:function(f,e,c,b){var a=new d;a.writeBeginTag("a");a.writeAttribute("id",f);a.writeAttribute("class",e);a.writeAttribute("role","button");a.writeAttribute("href","#");if(b){a.writeAttribute("title",b);a.writeAttribute("aria-label",b)}a.writeTagRightChar();a.writeBeginTag("span");a.writeAttribute("class",c);a.writeTagRightChar();b&&a.write(b);a.writeEndTag("span");a.writeEndTag("a");return a.toString()},_getTitleText:function(d){if(this._myGrid!==undefined)return this._myGrid.getTitle();else{var b=d||this.getDisplayDate(),c=this.options.titleFormat||"MMMM yyyy";return a.isFunction(this.options.title)?this.options.title(b,c)||this._formatDate(c,b):this._formatDate(c,b)}},_refreshTitle:function(){this.element.find(".ui-datepicker-title").html(this._getTitleText())},_fillTitle:function(a,b){a.writeBeginTag("div");a.writeAttribute("class","ui-datepicker-title wijmo-wijcalendar-title ui-state-default ui-corner-all");a.writeTagRightChar();a.write(this._getTitleText(b));a.writeEndTag("div")},_getHeaderHtml:function(g,e,c){var h=!!this.element.data("preview.wijcalendar"),f=h?"none":this._isSingleMonth()?this.options.navButtons:"default",b=this.element.is(".ui-datepicker-rtl"),a=new d;if(f==="quick"){a.writeBeginTag("div");a.writeAttribute("class","ui-widget-header wijmo-wijcalendar-header ui-helper-clearfix ui-corner-all");a.writeAttribute("role","heading");a.writeTagRightChar();!!e&&a.write(this._getNavButtonHtml("quickprev","wijmo-wijcalendar-navbutton ui-datepicker-prev ui-corner-all","ui-icon ui-icon-seek-"+(b?"next":"prev"),this.options.quickPrevTooltip.replace("#",this.options.quickNavStep)));a.writeBeginTag("div");a.writeAttribute("class","ui-datepicker-header wijmo-wijcalendar-header-inner");a.writeTagRightChar();!!e&&a.write(this._getNavButtonHtml("prev","wijmo-wijcalendar-navbutton ui-datepicker-prev ui-corner-all","ui-icon ui-icon-circle-triangle-"+(b?"e":"w"),this.options.prevTooltip));this._fillTitle(a,g);!!c&&a.write(this._getNavButtonHtml("next","wijmo-wijcalendar-navbutton ui-datepicker-next ui-corner-all","ui-icon ui-icon-circle-triangle-"+(b?"w":"e"),this.options.nextTooltip));a.writeEndTag("div");!!c&&a.write(this._getNavButtonHtml("quicknext","wijmo-wijcalendar-navbutton ui-datepicker-next ui-corner-all","ui-icon ui-icon-seek-"+(b?"prev":"next"),this.options.quickNextTooltip.replace("#",this.options.quickNavStep)));a.writeEndTag("div")}else{a.writeBeginTag("div");a.writeAttribute("class","ui-datepicker-header ui-widget-header ui-datepicker-header ui-helper-clearfix ui-corner-all");a.writeAttribute("role","heading");a.writeTagRightChar();f!=="none"&&!!e&&a.write(this._getNavButtonHtml("prev","wijmo-wijcalendar-navbutton ui-datepicker-prev ui-corner-all","ui-icon ui-icon-circle-triangle-"+(b?"e":"w"),this.options.prevTooltip));this._fillTitle(a,g);f!=="none"&&!!c&&a.write(this._getNavButtonHtml("next","wijmo-wijcalendar-navbutton ui-datepicker-next ui-corner-all","ui-icon ui-icon-circle-triangle-"+(b?"w":"e"),this.options.nextTooltip));a.writeEndTag("div")}return a.toString()},_formatDate:function(c,a){return!b.getTicks(a)?"&nbsp;":Globalize.format(a,c,this._getCulture())}});var d=function(){this._html=[]};d.prototype={_html:null,writeTagLeftChar:function(){this._html[this._html.length]="<"},writeTagRightChar:function(){this._html[this._html.length]=">"},write:function(a){this._html[this._html.length]=" "+a+" "},writeBeginTag:function(a){this._html[this._html.length]="<"+a},writeEndTag:function(a){this._html[this._html.length]="</"+a+">"},writeFullBeginTag:function(a){this._html[this._html.length]="<"+a+">"},writeSelfClosingTagEnd:function(){this._html[this._html.length]="/>"},writeAttribute:function(b,a){if(a===undefined||a===null)return;this._html[this._html.length]=" "+b+'="';this._html[this._html.length]=a;this._html[this._html.length]='"'},clean:function(){this._html=[]},toString:function(){return this._html.join("")}};var b={addDays:function(a,c){var b=new Date(a.getFullYear(),a.getMonth(),a.getDate()+c);if(c)if(b.getDate()===a.getDate()){b=new Date(a.getFullYear(),a.getMonth(),a.getDate());b.setTime(b.getTime()+c*864e5)}return b},addMonths:function(a,b){return new Date(a.getFullYear(),a.getMonth()+b,1)},addYears:function(b,a){return this.addMonths(b,a*12)},getDate:function(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate())},getTicks:function(a){return a.valueOf()},isSameDate:function(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()},isSameMonth:function(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()},getDaysInMonth:function(a){return new Date(a.getFullYear(),a.getMonth()+1,0).getDate()},getWeekStartDate:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate()-(a.getDay()-b+7)%7)},getDayOfYear:function(a){var c=new Date(a.getFullYear(),0,1),b=this.getTicks(a)-this.getTicks(c),d=b/864e5;return Math.floor(d)+1},getFirstDayWeekOfYear:function(c,e){var d=this.getDayOfYear(c)-1,a=c.getDay()-d%7,b;a=(a-e+14)%7;b=(d+a)/7;return Math.floor(b)+1},getDayOfWeek:function(b,a){return(b.getDay()-a+7)%7},getWeekOfYearFullDays:function(d,f,b,e){var c=this.getDayOfYear(d)-1,a=this.getDayOfWeek(d,b)-c%7;a=(b-a+14)%7;if(a&&a>=e)a-=7;a=c-a;return a>=0?Math.floor(a/7)+1:this.getWeekOfYearFullDays(this.addDays(d,-(c+1)),f,b,e)},getWeekOfYear:function(b,c,a){switch(c){case"firstDay":return this.getFirstDayWeekOfYear(b,a);case"firstFullWeek":return this.getWeekOfYearFullDays(b,c,a,7);case"firstFourDayWeek":return this.getWeekOfYearFullDays(b,c,a,4)}return this.getFirstDayWeekOfYear(b,a)},getDateToken:function(a){return a.getFullYear()+"_"+a.getMonth()+"_"+a.getDate()}},e=function(c,a){this.calendar=c;if(a===undefined||b.isSameDate(a,new Date(1900,0,1)))a=new Date;this.displayDate=a;this.id=this.calendar._getId()+"_"+this.calendar._getMonthID(a);this.isFirst=false;this.isLast=false;this.showPreview=false;this.culture=this.calendar._getCulture();this._calcDates(this.displayDate)};e.prototype={_calcDates:function(a){var c=b.getDaysInMonth(a);this._startDateInMonth=new Date(a.getFullYear(),a.getMonth(),1);this._endDateInMonth=b.addDays(this._startDateInMonth,c-1);this._startDate=b.getWeekStartDate(this._startDateInMonth,this.culture.calendar.firstDay);this._endDate=b.addDays(this._startDate,this.calendar.options.dayRows*this.calendar.options.dayCols-1)},_isFirstMonth:function(){var a=this.calendar.getDisplayDate();return b.isSameMonth(this._startDateInMonth,a)},_isLastMonth:function(){var a=this.calendar.getDisplayDate();a=new Date(a.getFullYear(),a.getMonth(),1);a=b.addMonths(a,this.calendar.options.monthCols*this.calendar.options.monthRows-1);return b.isSameMonth(this._startDateInMonth,a)},getStartDate:function(){return this._startDate},getEndDate:function(){return this._endDate},_getMonthDate:function(){this._startDateInMonth===undefined&&this._calcDates(this.getDisplayDate());return this._startDateInMonth},_setMonthDate:function(a){this._calcDates(a)},_getWeekDayText:function(c,d){d=d||"short";var b=this.culture.calendar.days,a="";switch(d){case"full":a=b.names[c];break;case"firstLetter":a=b.names[c].substring(0,1);break;case"abbreviated":a=b.namesAbbr[c];break;default:a=b.namesShort[c]}return a},_getRowCount:function(){var a=this.calendar.options;return a.showWeekDays?a.dayRows+1:a.dayRows},_getColCount:function(){var a=this.calendar.options;return a.showWeekNumbers?a.dayCols+1:a.dayCols},_getDayType:function(d){var e=this.calendar.options,a=c.general,h=d.getDay(),m=h===6||h===0,g=d<e.minDate||d>e.maxDate,f=d<this._startDateInMonth||d>this._endDateInMonth,i=g||this.calendar._getDisabledDates().contains(d),j=this.calendar._getSelectedDates().contains(d),n=new Date,l=b.isSameDate(d,n),k=false;if(m)a|=c.weekEnd;if(l)a|=c.today;if(i)a|=c.disabled;if(f)a|=c.otherMonth;if(g)a|=c.outOfRange;if(j)a|=c.selected;if(k)a|=c.custom;if(f&&!e.showOtherMonthDays)a|=c.gap;return a},_refreshDate:function(b){if(b<this._startDate||b>this._endDate)return;var j=this.calendar.options,i=Math.floor(Math.abs(b-this._startDate)/864e5),f=Math.floor(i/this.calendar.options.dayCols),e=Math.floor(i%this.calendar.options.dayCols),c,g,d,h;if(j.showWeekNumbers)e++;if(j.showWeekDays)f++;c=a("#"+this.id,this.calendar.element).get(0);if(c)if(f<c.rows.length){g=c.rows[f];if(e<g.cells.length){d=g.cells[e];h=this._getDayType(b);a(d).attr("daytype",h.toString());this.calendar._refreshDayCell(d)}}},_fillDayCell:function(a,b,k){var j=this.calendar.options,f=null,d=b.getDate().toString(),h=this.calendar._formatDate(j.toolTipFormat||"dddd, MMMM dd, yyyy",b),e=this._getDayType(b),g=this.calendar._isSelectable(e),i=this.calendar._getCellClassName(e,b,k);d=j.showDayPadding&&d.length===1?"0"+d:d;a.writeBeginTag("td");a.writeAttribute("daytype",e.toString());if(g){a.writeAttribute("title",h);a.writeAttribute("aria-label",h)}a.writeAttribute("date",b.toDateString());a.writeAttribute("class",i.cssCell);a.writeAttribute("role","gridcell");!g&&a.writeAttribute("aria-disabled","true");a.writeTagRightChar();if(e&c.gap)a.write("&#160;");else if(f&&f.content)a.write(f.content);else{a.writeBeginTag("a");a.writeAttribute("class",i.cssText);a.writeAttribute("href","#");a.writeAttribute("onclick","return false;");a.writeTagRightChar();a.write(d);a.writeEndTag("a")}a.writeEndTag("td")},getHtml:function(g){g=!!g;var c=this.calendar.options,h=!!this.calendar.element.data("preview.wijcalendar"),a=new d,e,m,f,k,q,o,r,l,j,i,p,n;!g&&c.showTitle&&a.write(this.calendar._getHeaderHtml(this._startDateInMonth,this.isFirst,this.isLast));if(!g&&!h&&this.showPreview){a.writeBeginTag("div");a.writeAttribute("class","wijmo-wijcalendar-prevpreview-button");a.writeAttribute("role","button");a.writeAttribute("aria-haspopup","true");a.writeAttribute("id","prevPreview");a.writeTagRightChar();a.writeBeginTag("a");a.writeAttribute("class","ui-icon ui-icon-grip-dotted-vertical");a.writeAttribute("href","#");a.writeAttribute("title",c.prevPreviewTooltip);a.writeAttribute("aria-label",c.prevPreviewTooltip);a.writeAttribute("onclick","return false;");a.writeTagRightChar();a.write("&#160;");a.writeEndTag("a");a.writeEndTag("div")}a.writeBeginTag("table");a.writeAttribute("id",this.id);a.writeAttribute("class","ui-datepicker-calendar wijmo-wijcalendar-table");a.writeAttribute("role","grid");a.writeAttribute("summary",this.calendar._getTitleText(this._startDateInMonth));a.writeAttribute("onselectstart","return false;");a.writeTagRightChar();if(c.showWeekDays){a.writeFullBeginTag("thead");a.writeBeginTag("tr");a.writeTagRightChar();if(c.showWeekNumbers){a.writeBeginTag("th");a.writeAttribute("id",this.id+"_ms");a.writeAttribute("class","ui-datepicker-week-col wijmo-wijcalendar-monthselector"+(!!c.selectionMode.month?" wijmo-wijcalendar-selectable":""));a.writeAttribute("role","columnheader");a.writeTagRightChar();if(!!c.selectionMode.month&&!h&&!c.disabledState){a.writeBeginTag("a");a.writeAttribute("class","ui-icon ui-icon-triangle-1-se");a.writeSelfClosingTagEnd()}else a.write("Wk");a.writeEndTag("th")}f=this._startDate.getDay();k=this._startDate;for(e=0;e<c.dayCols;e++){q=f===6||f===0;o=e+(c.showWeekNumbers?1:0);r=this._getWeekDayText(f,c.weekDayFormat);l=this._getWeekDayText(f,"full");a.writeBeginTag("th");a.writeAttribute("id",this.id+"_cs_"+o);a.writeAttribute("class","ui-datepicker-week-day"+(q?" ui-datepicker-week-end":"")+(!!c.selectionMode.weekDay?" wijmo-wijcalendar-selectable":""));a.writeAttribute("role","columnheader");a.writeTagRightChar();a.writeBeginTag("span");a.writeAttribute("title",l);a.writeAttribute("aria-label",l);a.writeTagRightChar();a.write(r);a.writeEndTag("span");a.writeEndTag("th");f=(f+1)%7;k=b.addDays(k,1)}a.writeEndTag("tr");a.writeEndTag("thead")}a.writeFullBeginTag("tbody");j=this._startDate;i=this._startDateInMonth;for(e=0;e<c.dayRows;e++){a.writeBeginTag("tr");a.writeTagRightChar();if(c.showWeekNumbers){p=e+(c.showWeekDays?1:0);a.writeBeginTag("td");a.writeAttribute("id",this.id+"_rs_"+p);a.writeAttribute("class","ui-datepicker-week-col wijmo-wijcalendar-week-num"+(!!c.selectionMode.weekNumber?" wijmo-wijcalendar-selectable":""));a.writeAttribute("role","rowheader");a.writeTagRightChar();n=b.getWeekOfYear(i,c.calendarWeekRule,this.culture.calendar.firstDay);a.write(n);a.writeEndTag("td");i=b.addDays(i,c.dayCols)}for(m=0;m<c.dayCols;m++){this._fillDayCell(a,j,h);j=b.addDays(j,1)}a.writeEndTag("tr")}a.writeEndTag("tbody");a.writeEndTag("table");if(!g&&!h&&this.showPreview){a.writeBeginTag("div");a.writeAttribute("class","wijmo-wijcalendar-nextpreview-button");a.writeAttribute("role","button");a.writeAttribute("aria-haspopup","true");a.writeAttribute("id","nextPreview");a.writeTagRightChar();a.writeBeginTag("a");a.writeAttribute("class","ui-icon ui-icon-grip-dotted-vertical");a.writeAttribute("href","#");a.writeAttribute("title",c.nextPreviewTooltip);a.writeAttribute("aria-label",c.nextPreviewTooltip);a.writeAttribute("onclick","return false;");a.writeTagRightChar();a.write("&#160;");a.writeEndTag("a");a.writeEndTag("div")}return a.toString()}};var f=function(b,a){this._calendar=b;this._optionName=a;this._normalize()};f.prototype={_calendar:null,_optionName:"selectedDates",getDates:function(){if(this._calendar.options[this._optionName]===undefined)this._calendar.options[this._optionName]=[];return this._calendar.options[this._optionName]},setDates:function(a){this._calendar.options[this._optionName]=a;this._normalize()},getCount:function(){return this.getDates().length},clear:function(){this.setDates([])},add:function(a){this.addRange(a,a)},remove:function(a){this.removeRange(a,a)},indexOf:function(a){return!this.getCount()?-1:this._findRangeBound(a,true,false)},contains:function(a){return this.indexOf(a)!==-1},removeRange:function(g,f){if(!this.getCount())return;var c=this._findRangeBound(g,false,true),a=this._findRangeBound(f,false,false),b,d,e;if(c<0||a<0)return;if(c>a)return;b=this.getDates();if(b[a]>f)return;d=!c?[]:b.slice(0,c);e=a>=b.length-1?[]:b.slice(a+1);this.setDates(d.concat(e))},addRange:function(c,d){this.removeRange(c,d);var g=this.getDates(),e=this._findRangeBound(c,false,true),h=!e?[]:g.slice(0,e),i=g.slice(e),f=[],a;c=b.getDate(c);d=b.getDate(d);for(a=c;a<=d;a=b.addDays(a,1))f[f.length]=a;this.setDates(h.concat(f.concat(i)))},_findRangeBound:function(f,h,g){var e=this.getDates(),c=0,d=e.length,a;while(c<d){a=c+d>>1;if(b.isSameDate(f,e[a]))return a;if(f<e[a])d=a;else c=a+1}return h?-1:g?c:d},_parseDate:function(a){var b;if(!a)a=new Date;else if(typeof a==="string")b=a;if(b){b=b.replace(/-/g,"/");try{a=new Date(b);if(isNaN(a))a=new Date}catch(c){a=new Date}}return a},_normalize:function(){var c=this._calendar.options[this._optionName],d=this,b;if(a.isArray(c)){b=a.map(c,function(a){return d._parseDate(a)});this._calendar.options[this._optionName]=b.sort(function(a,b){return a.getTime()-b.getTime()})}}};var g=function(a){this.gridType="month";this.calendar=a;this.culture=a._getCulture()};g.prototype={gridType:"month",calendar:null,culture:undefined,select:function(c,b){var a=this.calendar.getDisplayDate();switch(this.gridType){case"month":a.setMonth(b);break;case"year":a.setFullYear(b);break;case"decade":a.setFullYear(b)}this.calendar.options.displayDate=a},getSelectedIndex:function(){var b=this.calendar.getDisplayDate(),a=b.getFullYear(),d=Math.floor(a/10)*10-1,c=Math.floor(a/100)*100-10;switch(this.gridType){case"month":return b.getMonth();case"year":return a-d;case"decade":return Math.floor((a-c)/10)}return 0},getTitle:function(){var d=this.calendar.getDisplayDate(),a=d.getFullYear(),c=Math.floor(a/10)*10-1,b=Math.floor(a/100)*100-10;switch(this.gridType){case"month":return a.toString();case"year":return c+1+" - "+(c+10);case"decade":return b+10+" - "+(b+109)}return""},getHtml:function(g,l){if(g===undefined)g=this.calendar.getDisplayDate();else if(typeof g==="boolean"){l=g;g=this.calendar.getDisplayDate()}l=!!l;var e=this.calendar.options,s=3,u=4,a=new d,p,h,o,r,q,t,m,n,c,k,f,j,b,i;e.showTitle&&!l&&a.write(this.calendar._getHeaderHtml(null,true,true));p=100/s+"%";p="30%";a.writeBeginTag("table");a.writeAttribute("class","ui-datepicker-calendar wijmo-wijcalendar-mygrid");a.writeAttribute("role","grid");a.writeAttribute("onselectstart","return false;");a.writeTagRightChar();h=g.getFullYear();o=g.getFullYear()*12;r=Math.floor(h/10)*10-1;q=Math.floor(h/100)*100-10;t=this.culture.calendar.months;for(m=0;m<s;m++){a.writeBeginTag("tr");a.writeAttribute("height",p);a.writeTagRightChar();for(n=0;n<u;n++){c=m*4+n;k=false;f=false;j="";b=null;switch(this.gridType){case"month":if(g.getMonth()===c)k=true;b=c;j=t.namesAbbr[c];f=o+c<e.minDate.getFullYear()*12+e.minDate.getMonth()||o+c>e.maxDate.getFullYear()*12+e.maxDate.getMonth();break;case"year":if(c===0||c===11)f=true;b=r+c;if(b<e.minDate.getFullYear()||b>e.maxDate.getFullYear())f=true;else k=h===b;j=b.toString();break;case"decade":if(c===0||c===11)f=true;b=q+c*10;if(b+10<e.minDate.getFullYear()||b>e.maxDate.getFullYear())f=true;else k=h>=b&&h<b+10;j=b.toString()+"-<br/>"+(b+9).toString()}i="ui-datepicker-week-day";if(f)i=i+" ui-datepicker-other-month ui-priority-secondary ui-datepicker-unselectable";else if(!e.disabledState)i+=" wijmo-wijcalendar-day-selectable";i+=" ui-state-default"+(f?" ui-state-disabled":"")+(k?" ui-state-active ui-state-highlight":"");a.writeBeginTag("td");a.writeAttribute("class",i);a.writeAttribute("role","gridcell");a.writeAttribute("index",c.toString());a.writeAttribute("value",b.toString());a.writeAttribute("other",f.toString());a.writeTagRightChar();a.writeBeginTag("a");a.writeAttribute("href","#");a.writeTagRightChar();a.write(j);a.writeEndTag("a");a.writeEndTag("td")}a.writeEndTag("tr")}a.writeEndTag("table");return a.toString()}}})(jQuery);
(function(a){"use strict";a.widget("wijmo.wijexpander",{options:{allowExpand:true,animated:"slide",contentUrl:"",expanded:true,expandDirection:"bottom"},_setOption:function(c,b){switch(c){case"contentUrl":if(b)this.element.find("> .ui-widget-content").wijContent(b);else this.element.find("> .ui-widget-content").html("");break;case"disabled":if(b)this.element.addClass("ui-state-disabled");else this.element.removeClass("ui-state-disabled");break;case"expandDirection":this._onDirectionChange(b,true,this.options.expandDirection);break;case"expanded":if(b)this.expand();else this.collapse();return}a.Widget.prototype._setOption.apply(this,arguments)},_create:function(){var d=this.element.children(),b,c;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);this.element.addClass("wijmo-wijexpander ui-expander ui-widget ui-helper-reset ui-expander-icons");b=a(d[0]);c=a(d[1]);if(this.options.expandDirection==="left"||this.options.expandDirection==="top"){b.remove();b.insertAfter(c)}b.addClass("ui-expander-header ui-helper-reset");b.attr("role","tab");c.attr("role","tabpanel");b.find("> a").length===0&&b.wrapInner('<a href="#"></a>');b.find("> .ui-icon").length===0&&a('<span class="ui-icon"></span>').insertBefore(a("> a",b)[0]);c.addClass("ui-expander-content ui-helper-reset ui-widget-content")},_init:function(){var b=this.options;this._onDirectionChange(b.expandDirection,false);b.contentUrl&&a(".ui-widget-content",this.element).wijContent(this.options.contentUrl);if(!b.expanded){this.element.find("> .ui-widget-content").hide();this.element.find("> .ui-expander-header").addClass("ui-state-default ui-corner-all").attr({"aria-expanded":"false",tabIndex:-1}).find("> .ui-icon").addClass(this._triangleIconClosed)}else{this.element.find("> .ui-expander-header").addClass("ui-state-active").attr({"aria-expanded":"true",tabIndex:0}).addClass(this._headerCornerOpened).find("> .ui-icon").addClass(this._triangleIconOpened);this.element.find("> .ui-widget-content").addClass("ui-expander-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility()}b.disabled&&this.element.addClass("ui-state-disabled");this._bindLiveEvents()},destroy:function(){this._unbindLiveEvents();this.element.removeClass("wijmo-wijexpander ui-expander ui-widget ui-helper-reset ui-expander-icons");a.Widget.prototype.destroy.apply(this,arguments)},_bindLiveEvents:function(){a(".ui-expander-header",this.element[0]).live("click.wijexpander",jQuery.proxy(this._onHeaderClick,this)).live("mouseenter.wijexpander",function(){a(this).addClass("ui-state-hover")}).live("mouseleave.wijexpander",function(){a(this).removeClass("ui-state-hover")}).live("focus.wijexpander",function(){a(this).addClass("ui-state-focus")}).live("blur.wijexpander",function(){a(this).removeClass("ui-state-focus")})},_unbindLiveEvents:function(){a(".ui-expander-header",this.element[0]).die(".wijexpander")},_onDirectionChange:function(l,g,j){var b,i,h,f,e,k,d,c;j&&j!==l&&this.element.removeClass("ui-expander-"+j);if(g){i=this.element.find(".ui-expander-header."+this._headerCornerOpened);i.removeClass(this._headerCornerOpened);h=this.element.find(".ui-widget-content."+this._contentCornerOpened);h.removeClass(this._contentCornerOpened);f=this.element.find("."+this._triangleIconOpened);e=this.element.find("."+this._triangleIconClosed);f.removeClass(this._triangleIconOpened);e.removeClass(this._triangleIconClosed)}switch(l){case"top":this._headerCornerOpened="ui-corner-bottom";this._contentCornerOpened="ui-corner-top";this._triangleIconOpened="ui-icon-triangle-1-n";this._triangleIconClosed="ui-icon-triangle-1-e";b=true;this.element.removeClass("ui-helper-horizontal");this.element.addClass("ui-expander-top");break;case"right":this._headerCornerOpened="ui-corner-left";this._contentCornerOpened="ui-corner-right";this._triangleIconOpened="ui-icon-triangle-1-e";this._triangleIconClosed="ui-icon-triangle-1-s";b=false;this.element.addClass("ui-helper-horizontal");this.element.addClass("ui-expander-right");break;case"left":this._headerCornerOpened="ui-corner-right";this._contentCornerOpened="ui-corner-left";this._triangleIconOpened="ui-icon-triangle-1-w";this._triangleIconClosed="ui-icon-triangle-1-s";b=true;this.element.addClass("ui-helper-horizontal");this.element.addClass("ui-expander-left");break;default:this._headerCornerOpened="ui-corner-top";this._contentCornerOpened="ui-corner-bottom";this._triangleIconOpened="ui-icon-triangle-1-s";this._triangleIconClosed="ui-icon-triangle-1-e";b=false;this.element.removeClass("ui-helper-horizontal");this.element.addClass("ui-expander-bottom")}k=this.element.data("rightToLeft");this.element.data("rightToLeft",b);if(g){f.addClass(this._triangleIconOpened);e.addClass(this._triangleIconClosed);i.addClass(this._headerCornerOpened);h.addClass(this._contentCornerOpened)}g&&b!==k&&this.element.children(".ui-expander-header").each(function(){c=a(this);if(b){d=c.next(".ui-expander-content");c.remove();c.insertAfter(d)}else{d=c.prev(".ui-expander-content");c.remove();c.insertBefore(d)}})},collapse:function(){var d=this.options,e,c,f,b;if(!d.allowExpand)return;if(this.element.hasClass("ui-state-disabled"))return false;if(!this._trigger("beforeCollapse"))return false;if(d.animated){e={expand:false,content:this.element.find("> .ui-widget-content"),complete:jQuery.proxy(function(){this.element.find("> .ui-widget-content").removeClass("ui-expander-content-active");this._trigger("afterCollapse");this.element.find("> .ui-widget-content").css("display","")},this),horizontal:this.element.hasClass("ui-helper-horizontal")};c=a.wijmo.wijexpander.animations;f=d.duration;b=d.animated;if(b&&!c[b]&&!a.easing[b])b="slide";if(!c[b])c[b]=function(a){this.slide(a,{easing:b,duration:f||700})};c[b](e)}else{this.element.find("> .ui-widget-content").hide();this._trigger("afterCollapse")}this.element.find("> .ui-expander-header").removeClass("ui-state-active").removeClass(this._headerCornerOpened).attr({"aria-expanded":"false",tabIndex:-1}).addClass("ui-state-default ui-corner-all").find("> .ui-icon").removeClass(this._triangleIconOpened).addClass(this._triangleIconClosed);this.options.expanded=false;return true},expand:function(){var d=this.options,e,c,f,b;if(!d.allowExpand)return;if(this.element.hasClass("ui-state-disabled"))return false;if(!this._trigger("beforeExpand"))return false;if(d.animated){e={expand:true,content:this.element.find("> .ui-widget-content"),complete:jQuery.proxy(function(){this.element.find("> .ui-widget-content").addClass("ui-expander-content-active").addClass(this._contentCornerOpened).wijTriggerVisibility();this._trigger("afterExpand");this.element.find("> .ui-widget-content").css("display","")},this),horizontal:this.element.hasClass("ui-helper-horizontal")};c=a.wijmo.wijexpander.animations;f=d.duration;b=d.animated;if(b&&!c[b]&&!a.easing[b])b="slide";if(!c[b])c[b]=function(a){this.slide(a,{easing:b,duration:f||700})};c[b](e)}else{this.element.find("> .ui-widget-content").show();this._trigger("afterExpand")}this.element.find("> .ui-expander-header").removeClass("ui-state-default ui-corner-all").addClass("ui-state-active").addClass(this._headerCornerOpened).attr({"aria-expanded":"true",tabIndex:0}).find("> .ui-icon").removeClass(this._triangleIconClosed).addClass(this._triangleIconOpened);this.options.expanded=true;return true},_onHeaderClick:function(){this.option("expanded",!this.options.expanded);return false}});a.extend(a.wijmo.wijexpander,{animations:{slide:function(b,c){b=a.extend({easing:"swing",duration:300},b,c);if(b.expand)b.content.stop(true,true).animate(b.horizontal?{width:"show",opacity:"show"}:{height:"show",opacity:"show"},b);else b.content.stop(true,true).animate(b.horizontal?{width:"hide",opacity:"hide"}:{height:"hide",opacity:"hide"},b)}}})})(jQuery);
(function(a){"use strict";var b="wijmo-wijmenu-item";a.widget("wijmo.wijmenu",{options:{trigger:"",triggerEvent:"click",position:{},animation:{animated:"slide",duration:400,easing:null},showAnimation:{},hideAnimation:{animated:"fade",duration:400,easing:null},showDelay:400,hideDelay:400,slidingAnimation:{duration:400,easing:null},mode:"flyout",superPanelOptions:null,checkable:false,orientation:"horizontal",direction:"ltr",maxHeight:200,backLink:true,backLinkText:"Back",topLinkText:"All",crumbDefaultText:"Choose an option",select:null,focus:null,blur:null,showing:null,items:[]},_preventEvent:function(a){a.preventDefault();a.stopImmediatePropagation()},_create:function(){var b=this,f=b.options,h=f.direction,c=f.mode,g,e=b.element,i,d=a.ui.keyCode;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);e.is(":hidden")&&e.wijAddVisibilityObserver&&e.wijAddVisibilityObserver(function(){b.refresh();e.wijRemoveVisibilityObserver&&e.wijRemoveVisibilityObserver()},"wijmenu");b.clickNameSpace="click.wijmenudoc"+b._newId();e.hide();b.cssPre="wijmo-wijmenu";b.nowIndex=9999;b.activeItem=null;b.refresh();e.attr("tabIndex",0);f.disabled&&b.disable();e.bind("keydown.wijmenuEvent",function(e){if(f.disabled)return;c==="sliding"&&b._getSublist().stop(true,true);var j=b.activeItem,k,m,l=f.orientation;if(j){k=j._isRoot();i=j._getSublist()}else k=true;switch(e.keyCode){case d.PAGE_UP:b.previousPage(e);b._preventEvent(e);break;case d.PAGE_DOWN:b.nextPage(e);b._preventEvent(e);break;case d.UP:if(l==="vertical"||c==="sliding"||!k){b.previous(e);b._preventEvent(e)}break;case d.DOWN:if(l==="vertical"||c==="sliding"||!k){b.next(e);b._preventEvent(e)}else if(j)if(c==="flyout"&&a.wijmo.wijmenu._hasVisibleSubMenus(j)>0)i.is(":hidden")&&j._showFlyoutSubmenu(e,function(){b.activate(e,j._getFirstSelectableSubItem())});break;case d.RIGHT:if(l==="horizontal"&&k&&c==="flyout"){if(h==="rtl")b.previous(e);else b.next(e);b._preventEvent(e)}else if(j){g=j.getParent();if(h==="rtl")b._keyDownToCloseSubmenu(c,e,g);else b._keyDownToOpenSubmenu(j,c,e,i)}break;case d.LEFT:if(l==="horizontal"&&k&&c==="flyout"){if(h==="rtl")b.next(e);else b.previous(e);b._preventEvent(e)}else{if(j)g=j.getParent();if(h==="rtl")b._keyDownToOpenSubmenu(j,c,e,i);else b._keyDownToCloseSubmenu(c,e,g)}break;case d.ENTER:if(!j)return;m=j._getLink();if(c==="flyout")break;else{b.select();m.is("a")&&m.attr("href")==="#"&&b._preventEvent(e)}break;case d.TAB:b.next(e);b._preventEvent(e)}})},_keyDownToOpenSubmenu:function(b,e,d,c){var f=this;if(e==="flyout"&&a.wijmo.wijmenu._hasVisibleSubMenus(b)>0)c.is(":hidden")&&b._showFlyoutSubmenu(d,function(){f.activate(d,b._getFirstSelectableSubItem())});else if(e==="sliding")c.length>0&&b._getLink().trigger("click",b._getFirstSelectableSubItem())},_keyDownToCloseSubmenu:function(f,e,c){var b=this,g=b.options,d;if(f==="flyout"){if(c){c._hideCurrentSubmenu();b.activate(e,c)}}else{g.backLink&&b._backLink&&b._backLink.is(":visible")&&b._backLink.trigger("click",function(){c&&b.activate(e,c)});d=a(".wijmo-wijmenu-breadcrumb",b.domObject.menucontainer).find("li a");d.length>0&&d.eq(d.length-2).trigger("click",function(){c&&b.activate(e,c)})}},_createMenuItems:function(){for(var b=this,c=[],e=b.options.items.length,f=b._getSublist().children("li").length,d=0;d<e-f;d++)b._getSublist().append("<li>");a(">li",b._getSublist()).each(function(f){var e=a(this),d=a.wijmo.wijmenu._getMenuItemOptions(b.options,f);c.push(b._createItemWidget(e,d))});return c},_createItemWidget:function(c,d){var b=a.wijmo.wijmenu._itemWidgetName;a.fn[b]&&c[b](d);return a.wijmo.wijmenu._getItemWidget(c)},_handleDisabledOption:function(b,c){var a=this;if(b){if(!a.disabledDiv)a.disabledDiv=a._createDisabledDiv(c);a.disabledDiv.appendTo(a.domObject.menucontainer)}else if(a.disabledDiv){a.disabledDiv.remove();a.disabledDiv=null}},_createDisabledDiv:function(){return a("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:"100%",height:"100%",left:0,top:0})},_destroy:function(){var a=this,b=a.options;a.destroying=true;a[b.mode==="flyout"?"_killFlyout":"_killDrilldown"]();a._killMenuItems();a._killtrigger();a._killElement();a.destroying=false},destroy:function(){var b=this;this._destroy();if(b.disabledDiv){b.disabledDiv.remove();b.disabledDiv=null}a.Widget.prototype.destroy.apply(this)},activate:function(i,e){if(!e)return;var b=this,h=b.domObject.scrollcontainer,c,d,g=false,f=true;c=(e.jquery?e:e.element).eq(0);if(b.activeItem&&b.activeItem.element.get(0)===c.get(0))return;b.deactivate(i);b.activeItem=a.wijmo.wijmenu._getItemWidget(c);d=c.children(":first");b._trigger("focus",i,{item:b.activeItem});if(b.options.mode==="sliding"){f=c.parent().is(".wijmo-wijmenu-current");g=f&&h.wijsuperpanel("needToScroll",c);if(g){b._linkContainer.link=d;b._linkContainer.needToFocus=true;h.wijsuperpanel("scrollChildIntoView",c)}}d.addClass("ui-state-focus").end();b.element.removeAttr("aria-activedescendant");b.element.attr("aria-activedescendant",c.attr("id"));f&&!g&&d.is("a")&&d.focus()},deactivate:function(){var a=this,b=a.activeItem;if(!b)return;setTimeout(function(){b._getLink().removeClass("ui-state-focus").removeAttr("id");a._trigger("blur")},0);a.activeItem=null},next:function(a){this._move("next",function(a){return a._getFirstSelectableSubItem()},a)},previous:function(a){this._move("previous",function(a){return a._getLastSelectableSubItem()},a)},first:function(){var b=this,c,d,a;if(!b.activeItem)return false;c=b._getActiveItemElement();d=b.activeItem._getParentOrMenu();a=d._getFirstSelectableSubItem();return a&&c[0]===a.element[0]},last:function(){var b=this,c,d,a;if(!b.activeItem)return false;c=b._getActiveItemElement();d=b.activeItem._getParentOrMenu();a=d._getLastSelectableSubItem();return a&&c[0]===a.element[0]},nextPage:function(g){var b=this,e=b._getActiveItemElement(),i,h,c,d,f;if(e)d=b.activeItem._getParentOrMenu();else{d=b;e=b._getFirstSelectableSubItem()}if(b.options.mode==="sliding"&&b._hasScroll()){if(!e||b.last()){b.activate(g,d._getFirstSelectableSubItem());return}i=e.offset().top;h=b.options.maxHeight;c=a.wijmo.wijmenu._getSelectableSubItems(d,function(e){var b=a(e.element),d=h-(b.offset().top-i+b.height()),c=b.height();return d<c&&d>-c});if(!c.length)c=d._getLastSelectableSubItem();else c=c[c.length-1];b.activate(g,c)}else{if(!e||b.last())f=d._getFirstSelectableSubItem();else f=d._getLastSelectableSubItem();b.activate(g,f)}},previousPage:function(g){var b=this,e=b._getActiveItemElement(),i,h,d,c,f;if(e)c=b.activeItem._getParentOrMenu();else{c=b;e=b._getFirstSelectableSubItem()}if(b.options.mode==="sliding"&&b._hasScroll()){if(!e||b.first()){b.activate(g,c._getLastSelectableSubItem());return}i=e.offset().top;h=b.options.maxHeight;d=a.wijmo.wijmenu._getSelectableSubItems(c,function(e){var b=a(e.element),d=b.offset().top-i+h-b.height(),c=b.height();return d<c&&d>-c});if(!d.length)d=c._getFirstSelectableSubItem();else d=d[0];b.activate(g,d)}else{if(!e||b.first())f=c._getLastSelectableSubItem();else f=c._getFirstSelectableSubItem();b.activate(g,f)}},select:function(d){var b=this,a=b.activeItem,c;b._trigger("select",d,{item:a});if(b.options.checkable){c=!a.options.selected;a._setOption("selected",c)}},_getActiveItemElement:function(){return this.activeItem?this.activeItem.element:null},setItemDisabled:function(d,b){var c=a(d,this.element);c.find(".wijmo-wijmenu-item>a").attr("disabled",b);c.find(">a").toggleClass("ui-state-disabled",b)},_setOption:function(b,c){var a=this;if(a.destroying)return;a["_set_"+b]&&a["_set_"+b](c);a.options[b]=c;b==="disabled"&&a._handleDisabledOption(c,a.domObject.menucontainer)},_set_items:function(b){var a=this;a._getSublist().children().remove();a.options.items=b;a.refresh()},_set_mode:function(b){var a=this;a._destroy();a.options.mode=b;a.refresh()},_set_backLink:function(d){var b=this,c;this.options.backLink=d;if(b.options.mode==="sliding"){b._killDrilldown();b._drilldown();c=a(".wijmo-wijmenu-breadcrumb",b.domObject.menucontainer);b._resetDrilldownMenu(c)}},_set_direction:function(){var a=this;a._destroy();a.refresh()},_set_orientation:function(e){var b=this,d=b.domObject.menucontainer,i=b.options.direction,c="ui-icon-triangle-1-",f=i==="rtl"?"w":"e",h=e==="horizontal"?f:"s",g=e==="horizontal"?"s":f;d.removeClass(b.cssPre+"-vertical "+b.cssPre+"-horizontal");if(b.options.mode==="flyout"){d.addClass(b.cssPre+"-"+e);a.each(b.getItems(),function(b,a){if(a.getItems().length===0)return;a._getLink().find("."+c+h).removeClass(c+h+" "+c+g).addClass(c+g)})}else d.addClass(b.cssPre+"-vertical")},_getTriggerEle:function(){return a.wijmo.wijmenu._getOuterElement(this.options.trigger,".wijmo-wijmenu")},_set_triggerEvent:function(d){var a=this,c=a.options,b=a._getTriggerEle();a._killtrigger();c.triggerEvent=d;b.length>0&&a._initTrigger(b);if(c.mode==="flyout"){a._killFlyout();a._flyout()}},_set_trigger:function(d){var a=this,c=a.options,b;a._killtrigger();c.trigger=d;b=a._getTriggerEle();b.length>0&&a._initTrigger(b);if(c.mode==="flyout"){a._killFlyout();a._flyout()}},_initTrigger:function(b){var f=this.options,e=f.triggerEvent,c=this,g=c.domObject.menucontainer,d=".wijmenuEvent";if(b.is("iframe"))b=a(b.get(0).contentWindow.document);switch(e){case"click":b.bind(e+d,function(a){f.mode!=="popup"&&c._displayMenu(a);a.stopPropagation()});break;case"mouseenter":b.bind(e+d,function(a){c._displayMenu(a);a.stopPropagation()});break;case"dblclick":b.bind(e+d,function(a){c._displayMenu(a);a.stopPropagation()});break;case"rtclick":b.bind("contextmenu"+d,function(a){g.hide();c._displayMenu(a);a.preventDefault();a.stopPropagation()})}},_killtrigger:function(){var c=this.options,b;if(c.trigger!==""){b=a(c.trigger);if(b.is("iframe"))b=a(b.get(0).contentWindow.document);b&&b.length>0&&b.unbind(".wijmenuEvent").unbind("wijmenuEvent")}},_move:function(i,g,e){var b=this,c=b._getActiveItemElement(),f,h,d;if(!c||!c.length){b.activate(e,g(b));return}d=a.wijmo.wijmenu._getItemWidget(c);f=d[i]();h=d._getParentOrMenu();if(f)b.activate(e,f);else b.activate(e,g(h))},refresh:function(){var b=this,d=b.element,h="wijmo-wijmenu",c=b.options,k=c.direction,f,e,j,g,i;b.domObject&&b._destroy();if(d.is("ul")){b._rootMenu=d;f=d.wrap("<div></div>").parent();e=f.wrap("<div></div>").parent()}else if(d.is("div")){b._rootMenu=a("ul:first",d);f=d;e=d.wrap("<div></div>").parent()}else return;k==="rtl"&&b._rootMenu.addClass(h+"-rtl");f.addClass("scrollcontainer checkablesupport");e.addClass("ui-widget ui-widget-header "+h+" ui-corner-all ui-helper-clearfix").attr("aria-activedescendant","ui-active-menuitem");c.orientation==="horizontal"&&c.mode==="flyout"&&e.addClass(h+"-"+c.orientation);j={scrollcontainer:f,menucontainer:e};b.domObject=j;b._getSublist().data("topmenu",true);!b._getSublist().hasClass(h+"-list ui-helper-reset")&&b._getSublist().addClass(h+"-list ui-helper-reset");b._items=b._createMenuItems();d.show();d.delegate("li>.wijmo-wijmenu-link","mouseenter.wijmenuEvent",function(){var b=a(this).hasClass("ui-state-disabled");if(c.disabled||b)return;a(this).addClass("ui-state-hover")}).delegate("li>.wijmo-wijmenu-link","mouseleave.wijmenuEvent",function(){var b=a(this).hasClass("ui-state-disabled");if(c.disabled||b)return;a(this).removeClass("ui-state-hover");a(this).data("subMenuOpened")&&a(this).addClass("ui-state-active")});this[c.mode==="flyout"?"_flyout":"_drilldown"]();if(c.trigger!==""){g=b._getTriggerEle();if(g.length>0){e.hide();b._initTrigger(g)}}a(document).bind(b.clickNameSpace,function(d){if(a(d.target).parent().is(".wijmo-wijmenu-all-lists"))return;if(a(d.target).closest(c.trigger).is(c.trigger))return;var f=a(d.target).closest(".wijmo-wijmenu");if(f.length===0){if(c.mode==="sliding"){i=a(".wijmo-wijmenu-breadcrumb",e);if(c.trigger==="")return;b._resetDrilldownMenu(i)}else if(c.mode==="flyout"&&c.triggerEvent!=="mouseenter"){b._hideAllMenus();return}g&&g.length>0&&b._hideMenu()}})},_flyout:function(){var b=this,c=b.domObject.menucontainer,d=b.options;c.attr("role","menu");d.orientation==="horizontal"&&c.attr("role","menubar");a.each(b.getItems(),function(){this._flyout()})},_hideAllMenus:function(){var b=this,e,d,c=function(b){if(b.getItems().length>0){a.each(b.getItems(),function(b,a){c(a)});b._hideSubmenu()}};a.each(b._items,function(b,a){c(a)});if(b.options.trigger!==""){e=b.domObject.menucontainer;if(e.is(":animated"))return;d=b._getTriggerEle();if(d.length===0)return;b._hideMenu()}},hideAllMenus:function(){this._hideAllMenus()},_killFlyout:function(){a.each(this.getItems(),function(){this._killFlyout()})},_killElement:function(){var b=this,c=b._getSublist();c.removeClass("wijmo-wijmenu-list ui-helper-reset wijmo-wijmenu-content ui-helper-clearfix");b.domObject.menucontainer.removeClass("");a(document).unbind(b.clickNameSpace);if(b.element.is("ul"))b.element.unwrap().unwrap();else b.element.unwrap();b.domObject=null;b.element.removeData("topmenu").removeData("firstLeftValue").removeData("domObject");c.undelegate(".wijmenuEvent")},_killMenuItems:function(){var b=this;a.each(b.getItems(),function(b,a){a.destroy(true)});b._items.length=0},_sroll:function(){var a=this.domObject.scrollcontainer,b=this.options.superPanelOptions||{};a.height(this.options.maxHeight);a.wijsuperpanel(b)},_initScrollCallback:function(){var a=this,b=a.domObject.scrollcontainer;a._linkContainer={link:null,needToFocus:false};b.wijsuperpanel({scrolled:function(){var b=a._linkContainer.link;if(a._linkContainer.needToFocus&&b&&b.is("a")){b.focus();a._linkContainer.needToFocus=false}}})},_resetScroll:function(f){var c=this,d=c.element.parent(),e=5,a=c.domObject.scrollcontainer,b=f._getSublist();d.height(b.height());a.wijsuperpanel("option","hScroller",{scrollValue:0});a.wijsuperpanel("option","vScroller",{scrollValue:0});a.wijsuperpanel("paintPanel");if(c._hasScroll()){if(b.prev().length>0)e=b.prev().css("padding-left").replace(/px/g,"");b.width(a.find(".wijmo-wijsuperpanel-contentwrapper:first").width()-e);d.height(b.height());a.wijsuperpanel("paintPanel")}},_hasScroll:function(){var a=this.domObject.scrollcontainer;return a.data("wijsuperpanel").vNeedScrollBar},_resetDrillChildMenu:function(a){a.removeClass("wijmo-wijmenu-scroll wijmo-wijmenu-current").height("auto")},_resetDrilldownMenu:function(i,e){var b=this,g=b.options,f=b._getSublist(),c=b.domObject.menucontainer,h=a('<li class="wijmo-wijmenu-breadcrumb-text">'+g.crumbDefaultText+"</li>"),d=function(c){a.each(c,function(f,e){var c=e._getSublist(),a=e.getItems();c.hide();b._resetDrillChildMenu(c);a.length>0&&d(a)})};a(".wijmo-wijmenu-current",c).removeClass("wijmo-wijmenu-current");f.animate({left:0},g.showDuration,function(){d(b.getItems());f.addClass("wijmo-wijmenu-current");e&&e()});a(".wijmo-wijmenu-all-lists",c).find("span").remove();i.empty().append(h);a(".wijmo-wijmenu-footer",c).empty().hide();b._resetScroll(b)},_drilldown:function(){var b=this,d=b._getSublist(),e=b.domObject.menucontainer.attr("role","menu"),g,c=b.options,h=c.direction,f=a('<ul class="wijmo-wijmenu-breadcrumb ui-state-default ui-corner-all ui-helper-clearfix"></ul>'),k=a('<li class="wijmo-wijmenu-breadcrumb-text">'+c.crumbDefaultText+"</li>"),n=c.backLink?c.backLinkText:c.topLinkText,l=c.backLink?"wijmo-wijmenu-prev-list":"wijmo-wijmenu-all-lists",j=c.backLink?"ui-state-default ui-corner-all":"",m=c.backLink?'<span class="ui-icon ui-icon-triangle-1-w"></span>':"",i=a('<li class="'+l+'"><a href="#" class="'+j+'">'+m+n+"</a></li>");d.wrap("<div>").parent().css("position","relative");e.addClass("wijmo-wijmenu-ipod wijmo-wijmenu-container");if(c.backLink)f.addClass("wijmo-wijmenu-footer").appendTo(e).hide();else f.addClass("wijmo-wijmenu-header").prependTo(e);!c.backLink&&f.append(k);g=e.width();d.addClass("wijmo-wijmenu-content wijmo-wijmenu-current ui-widget-content ui-helper-clearfix").css({width:g});a.each(b.getItems(),function(b,a){a._setDrilldownUlStyle()});b._sroll();b._initScrollCallback();b._resetScroll(b);b.element.data("firstLeftValue",parseFloat(d.css("left")));d.delegate("li>.wijmo-wijmenu-link","click",function(m,v){var u=a(this).parent(),w=u.attr("disabled"),t,q,l,s,p,n,k,o,r,j=a.wijmo.wijmenu._getItemWidget(u);if(c.disabled||w)return;d.stop(true,true);r=a.wijmo.wijmenu._hasVisibleSubMenus(j);if(!r){b._leafNodeClick(m,j,f);return}t=j._getSublist();q=j._getParentOrMenu()._getSublist();l=q.data("topmenu")?0:parseFloat(d.css("left"));if(h==="rtl")n=Math.round(l+parseFloat(e.width()));else n=Math.round(l-parseFloat(e.width()));k=a(".wijmo-wijmenu-footer",e);o=function(h,f){var i=h,c=a(".wijmo-wijmenu-current",e),d,g;if(c.get(0)===b._getSublist().get(0))return;if(f){d=f._getSublist();g=f}else{d=c.parents("ul:eq(0)");g=a.wijmo.wijmenu._getItemWidget(c.parent())._getParentOrMenu()}c.hide().attr("aria-expanded","false");b._resetDrillChildMenu(c);b._resetScroll(g);d.addClass("wijmo-wijmenu-current").attr("aria-expanded","true");if(d.hasClass("wijmo-wijmenu-content")){i.remove();k.hide()}};b._resetDrillChildMenu(q);b._resetScroll(j);b._slidingAnimation(d,n,function(){b.activate(m,v||j);b.select(m)});t.show().addClass("wijmo-wijmenu-current").attr("aria-expanded","true");if(c.backLink){if(k.find("a").size()===0){k.show();b._backLink=a('<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>'+c.backLinkText+"</span></a>").appendTo(k).click(function(j,g){if(c.disabled)return;var i=a(this),f;d.stop(true,true);if(h==="rtl")f=parseInt(d.css("left").replace("px",""),10)-parseInt(e.width(),10);else{f=parseInt(d.css("left").replace("px",""),10)+parseInt(e.width(),10);if(f>l)return}b._slidingAnimation(d,f,function(){o(i);g&&g()});j.preventDefault()})}}else{if(f.find("li").size()===1){f.empty().append(i);i.find("a").click(function(c,a){b._resetDrilldownMenu(f,a);c.preventDefault()})}a(".wijmo-wijmenu-current-crumb",e).removeClass("wijmo-wijmenu-current-crumb");s=j._getLink().text();p=a('<li class="wijmo-wijmenu-current-crumb"><a href="#" class="wijmo-wijmenu-crumb">'+s+"</a></li>");p.appendTo(f).find("a").click(function(k,i){if(c.disabled)return;var e=a(this).parent(),f;if(!e.is(".wijmo-wijmenu-current-crumb")){if(h==="rtl")f=+e.prevAll().length*g;else f=-e.prevAll().length*g;b._slidingAnimation(d,f,function(){o(null,j);i&&i()});e.addClass("wijmo-wijmenu-current-crumb").find("span").remove();e.nextAll().remove();k.preventDefault()}});p.prev().append(' <span class="ui-icon ui-icon-carat-1-e"></span>')}a(this).attr("href")==="#"&&m.preventDefault()})},_leafNodeClick:function(b,c,e){var a=this,f=a.options,d;a.activate(b,c);a.select(b);if(f.trigger){d=a._getTriggerEle();if(d.length){a._hideMenu();a._resetDrilldownMenu(e)}}c._getLink().attr("href")==="#"&&b.preventDefault()},_slidingAnimation:function(d,c,b){var a=this.options.slidingAnimation;if(a&&!a.disabled)d.stop(true,true).animate({left:c},a.duration,a.easing,b);else{d.css("left",c);b.call(this)}},_killDrilldown:function(){var c=this._getSublist(),b=this.domObject,d={width:"",height:""};c.css(d).removeClass("ui-widget-content");if(b.scrollcontainer&&b.scrollcontainer.parent().length>0){b.scrollcontainer.css(d);b.scrollcontainer.wijsuperpanel("destroy");b.scrollcontainer.removeClass("wijmo-wijsuperpanel").append(c)}c.prevAll().remove();b.menucontainer.removeClass("wijmo-wijmenu-ipod wijmo-wijmenu-container");a(".wijmo-wijmenu-current",b.menucontainer).removeClass("wijmo-wijmenu-current");a(".wijmo-wijmenu-breadcrumb",b.menucontainer).remove();c.undelegate("li>.wijmo-wijmenu-link","click");a("ul",c).css({left:"",width:""});c.css("left","");b.scrollcontainer=b.menucontainer.children(":first")},_displayMenu:function(h){var b=this,d=b.options,e,g,f,c=b.domObject.menucontainer,j=a(h.target),i=!a.wijmo.wijmenu._hasVisibleSubMenus(b);if(c.is(":visible")||i)return;b._trigger("showing",h,b);c.show();b._setPosition(j);b.nowIndex++;b._setZindex(c,b.nowIndex);c.hide();e={context:c,show:true};g=d.direction==="rtl"?"right":"left";f=a.extend({},{option:{direction:g}},d.animation,d.showAnimation);a.wijmo.wijmenu._animateFlyoutMenu(f,e);b._isClickToOpen=d.triggerEvent==="click"},_hideMenu:function(){var c=this,f=c.options,b=this.domObject.menucontainer,g=a.wijmo.wijmenu.animations,d,e;if(a.fn.wijhide){d={context:b,show:false};e=a.extend({},f.animation,f.hideAnimation);b.wijhide(e,g,d,null,function(){c._setZindex(b);b.attr("aria-hidden",true)})}else{b.hide().attr("aria-hidden",true);c._setZindex(b)}this.element.data("shown",false)},_setZindex:function(c,d){var e=this.domObject,b;if(!e)return;b=e.menucontainer;if(c.get(0)===b.get(0)){if(d)b.css("z-index",d);else b.css("z-index","");return}if(d){c.parent().css("z-index",999);c.css("z-index",d);a.browser.msie&&a.browser.version<8&&b.css("z-index")===0&&b.css("z-index",9950)}else{c.css("z-index","");c.parent().css("z-index","");a.browser.msie&&a.browser.version<8&&a("ul:visible",this._getSublist()).length===0&&b.css("z-index")===9950&&b.css("z-index","")}},_setPosition:function(c){var d=this._getPosition(),e={of:c},b=this.domObject.menucontainer;b.css({left:"0",top:"0",position:"absolute"});b.position(a.extend(e,d))},_getPosition:function(){var c=this.options,d=c.direction,b=d==="rtl"?{my:"right top",at:"right bottom"}:{my:"left top",at:"left bottom"};b=a.extend(b,c.position);return b},_getFirstSelectableSubItem:function(){return a.wijmo.wijmenu._getFirstSelectableSubItem(this)},_getLastSelectableSubItem:function(){return a.wijmo.wijmenu._getLastSelectableSubItem(this)},add:function(b,c){a.wijmo.wijmenu._add(this,b,c)},_getSublist:function(){return this._rootMenu},getItems:function(){return this._items},remove:function(b){a.wijmo.wijmenu._remove(this,b)},_newId:function(){for(var c=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],a="",b=0;b<16;b++)a+=c[Math.round(Math.random()*25)];return a}});a.widget("wijmo.wijmenuitem",{options:{header:false,separator:false,value:"",text:"",navigateUrl:"",target:"",iconClass:"",imagePosition:"",displayVisible:true,selected:false,items:[]},_initState:function(){this._items=[];this._resetMarkupValue()},_create:function(){var b=this;b._initState();b._getOrSetOptionsValues();b._createChildMenuItems();b._initCssClass();a.Widget.prototype._create.apply(b,arguments)},_refresh:function(){var a=this,b=a.options;a._set_navigateUrl(b.navigateUrl);a._set_target(b.target);a._set_displayVisible(b.displayVisible);a._createChildMenuItems();a._initCssClass()},_setOption:function(c,e){var b=this,f=b.options,d;if(c==="items"){a.Widget.prototype._setOption.apply(b,arguments);b._set_items(e);return}if(e===f[c])return;a.Widget.prototype._setOption.apply(b,arguments);if(!a.isFunction(b["_set_"+c]))return;b["_set_"+c](e,true);switch(c){case"header":case"separator":b._refresh();break;case"displayVisible":d=b.getParent();d&&d._setSubmenuIcon()}},index:function(){return this.element.index()},_set_selected:function(c){var a=this,b=a._getMenuItemType();if(b===a._markupType.link)a._getLink().toggleClass("ui-state-active",c);else a.options.selected=false},_set_items:function(b){var a=this;a._getSublist().remove();a._items=[];if(b.length>0){a._createChildMenuItems();a._initUlCssClass()}a._setSubmenuIcon(b.length>0);a._bindModeEvents(a,true);a._resetMarkupValue()},_bindModeEvents:function(b,c){var a=this,d=b._getMenu(),e=d.options;if(c){a._initUlCssClass();a._setSubmenuIcon();a._resetMarkupValue()}if(e.mode==="flyout")if(c){a._killFlyout();a._flyout()}else b._flyout();else{a._setDrilldownUlStyle();b.element.parent().is(":visible")&&d._resetScroll(b._getParentOrMenu())}},_set_value:function(a){this.options.value=a},_set_text:function(b,c){var a=this,d=a.options;if(b||c)a._setText(b);else d.text=a._getText()},_set_navigateUrl:function(b,d){var c=this,e=c.options,a=c._getLink();if(a.is("a"))if(b||d)a.attr("href",b);else e.navigateUrl=a.attr("href")},_set_target:function(e,d){var b=this,c=b.options,a=b._getLink();if(a.is("a"))if(c.target||d)a.attr("target",e);else c.target=a.attr("target")||""},_set_iconClass:function(g,i){var e=this,f=e.options,d,b,c,h;if(f.header===true||f.separator===true)return;d=e._getLink();b=d.find("span.wijmenuitem-icon");if(g){if(b.length===0){b=a("<span>");c=d.children(".wijmo-wijmenu-text").wrap("<span>").parent();c.addClass("wijmo-wijmenu-text");c.prepend(b)}b.attr("class",g+" wijmo-wijmenu-icon-left wijmenuitem-icon");i&&e._set_imagePosition(f.imagePosition)}else if(b.length!==0){b.remove();c=d.children(".wijmo-wijmenu-text");h=c.text();c.html("");c.text(h)}e._getMenuItemType()===e._markupType.other&&d.addClass("wijmo-wijmenu-link ui-corner-all")},_set_imagePosition:function(c){var e=this,d=e._getLink(),a=d.find(">span>span.wijmenuitem-icon"),b=c==="right"?"right":"left";if(a.length===0)return;a.removeClass("wijmo-wijmenu-icon-right").removeClass("wijmo-wijmenu-icon-left").addClass("wijmo-wijmenu-icon-"+b)},_set_separator:function(d,i){var a=this,e=a.element,c=a.options,j=a._getLink(),f="wijmo-wijmenu",g=f+"-separator ui-state-default ui-corner-all",h="ui-widget "+b+" ui-state-default ui-corner-all";if(i&&d===false){e.html("").removeClass(g).removeClass(h);a._createMenuItemMarkup(a._markupType.link).appendTo(e)}else if(d===true||j.length===0){c.separator=true;c.header=false;a._createMenuItemMarkup(a._markupType.separator)}else c.separator=false;a._resetMarkupValue()},_set_header:function(f,i){var a=this,e=a.element,d=a.options,c=a._getLink(),h="ui-widget-header ui-corner-all",g="ui-widget "+b+" ui-state-default ui-corner-all";if(i&&f===false){d.header=false;e.html("").removeClass(h).removeClass(g);a._createMenuItemMarkup(a._markupType.link).appendTo(e)}else if(f===true||c.is("h1,h2,h3,h4,h5")){d.header=true;d.separator=false;if(!c.is("h1,h2,h3,h4,h5")){c.remove();c=a._createMenuItemMarkup(a._markupType.header);e.append(c)}}else d.header=false;a._resetMarkupValue()},_set_displayVisible:function(b){var c=this,a=c.element;if(b)a.show();else a.hide()},_markupType:{link:0,separator:1,header:2,other:3},_createMenuItemMarkup:function(d){var b=this,e=b.options,f=b.element,c;if(d===b._markupType.separator){f.html("");return null}else if(d===b._markupType.header)c=a("<h3></h3>").text(e.text);else c=a("<a>").text(e.text);return c},_getMenuItemType:function(e){var b=this,c=b.options,d=b._getLink();if(e)c=a.extend({},c,e);return c.separator===true?b._markupType.separator:c.header===true?b._markupType.header:d.length===0?c.text?b._markupType.link:b._markupType.separator:d.is("a")?b._markupType.link:d.is("h1,h2,h3,h4,h5")?b._markupType.header:b._markupType.other},_getOrSetOptionsValues:function(){var a=this,e=a.element,b=a.options,c=a._getLink(),d=a._getMenuItemType();if(d===a._markupType.header){a._set_header(b.header);a._set_text(b.text)}else if(d===a._markupType.separator)a._set_separator(b.separator);else{if(c.length===0){c=a._createMenuItemMarkup(d);e.append(c)}else a._set_text(b.text);a._resetMarkupValue();a._set_navigateUrl(b.navigateUrl);a._set_target(b.target)}a._set_displayVisible(b.displayVisible);a._set_selected(b.selected)},_getText:function(){return this._getLink().text()},_setText:function(b){var c=this.element,a;a=c.find(":not(ul)a .wijmo-wijmenu-text:first");if(a.length!==0){a.text(b);return}a=c.children("h1,h2,h3,h4,h5").filter(":first");if(a.length!==0){a.text(b);return}a=c.children("a:first");if(a.length!==0){a.text(b);return}},_createChildMenuItems:function(){var b=this,i=b.element,h=b._items,g=b.options,d,c,e,f;if(g.header===true||g.separator===true)return;d=g.items.length;c=b._getSublist();e=c.children("li").length;if(d>e){if(c.length===0){c=a("<ul>").appendTo(i);b._resetMarkupValue()}for(f=0;f<d-e;f++)c.append("<li>")}a.each(b._getChildren(),function(f,d){var e=a(d),c;c=a.wijmo.wijmenu._getMenuItemOptions(b.options,f);h.push(b._createItemWidget(e,c))})},_createItemWidget:function(b,d){var e=this,c=a.wijmo.wijmenu._itemWidgetName;b[c](d);return b.data(e.widgetName)},_initCssClass:function(){var a=this,c=this.element,h=a.options,g=a._getLink(),e="wijmo-wijmenu",i=e+"-separator ui-state-default ui-corner-all",k="ui-widget-header ui-corner-all",f="ui-widget "+b+" ui-state-default ui-corner-all",j=e+"-link ui-corner-all",d=a._getMenuItemType();d!==a._markupType.separator&&c.attr("role","menuitem");if(d===a._markupType.separator)c.addClass(i);else if(d===a._markupType.header)c.addClass(k);else{if(d===a._markupType.link){if(!c.hasClass(b)){c.addClass(f);g.addClass(j);g.wrapInner("<span>").children("span").addClass(e+"-text")}}else c.addClass(f);a._setSubmenuIcon()}a._set_iconClass(h.iconClass);a._set_imagePosition(h.imagePosition);a._initUlCssClass()},_initUlCssClass:function(){var a="wijmo-wijmenu";this._getSublist().addClass(a+"-list ui-widget-content ui-corner-all ui-helper-clearfix "+a+"-child ui-helper-reset").hide()},_setSubmenuIcon:function(e){var d=this,c=d._getLink(),g=d._getMenu(),f=g.options.direction,b=f==="rtl"?c.children("span.ui-icon:first"):c.children("span.ui-icon:last");if(e===undefined)e=a.wijmo.wijmenu._hasVisibleSubMenus(d);if(e&&!c.is(":input")){if(b.length===0)if(f==="rtl")b=a("<span>").prependTo(c);else b=a("<span>").appendTo(c);if(d._isRoot()&&g.options.orientation==="horizontal"&&g.options.mode==="flyout")b.attr("class","ui-icon ui-icon-triangle-1-s");else if(f==="rtl")b.attr("class","ui-icon ui-icon-triangle-1-w");else b.attr("class","ui-icon ui-icon-triangle-1-e")}else b.remove()},_killFlyout:function(){var b=this.element.attr("role","");b.removeClass("wijmo-wijmenu-parent").unbind(".wijmenuEvent").unbind(".wijmenuitem").children(":first").unbind(".wijmenuEvent").unbind(".wijmenuitem").attr("aria-haspopup","");this._getSublist().unbind(".wijmenuEvent").unbind(".wijmenuitem");a.each(this.getItems(),function(){this._killFlyout()})},_getItemTriggerEvent:function(){var d=this,e=d.element,f=d._getMenu(),b=f.options,c="default";if(b.trigger!=="")if(e.is(b.trigger)||f.element.is(b.trigger))c=b.triggerEvent;else{e.parents(".wijmo-wijmenu-parent").each(function(e,d){if(a(d).is(b.trigger)){c=b.triggerEvent;return false}});if(c==="default"&&d._isOuterTirggerEle())c=b.triggerEvent}e.data("triggerEvent",c);return c},_isOuterTirggerEle:function(){var b=this._getMenu();return a.wijmo.wijmenu._getOuterElement(b.options.trigger,".wijmo-wijmenu").length>0},_flyout:function(){var b=this,e=b._getMenu(),n="wijmo-wijmenu-link",k="wijmo-wijmenu-parent",c=e.options,f=".wijmenuitem",j=a(b.element).attr("aria-haspopup",true),l,i,m=b._getItemTriggerEvent(),d=j.children("a."+n),g=b._getSublist(),h;if(b.getItems().length>0){g.bind("mouseleave"+f,function(){if(c.disabled)return;i=setTimeout(function(){b._hideCurrentSubmenu()},c.hideDelay)});j.removeClass(k).addClass(k);if(m!=="default"&&c.triggerEvent!=="mouseenter"){switch(c.triggerEvent){case"click":d.bind("click"+f,function(d){if(c.disabled||a(this).hasClass("ui-state-disabled"))return;b._showFlyoutSubmenu(d)});break;case"dblclick":d.bind("dblclick"+f,function(d){if(c.disabled||a(this).hasClass("ui-state-disabled"))return;b._showFlyoutSubmenu(d)});break;case"rtclick":d.bind("contextmenu"+f,function(d){if(c.disabled||a(this).hasClass("ui-state-disabled"))return;b._showFlyoutSubmenu(d);d.preventDefault()})}g.data("notClose",true)}else{d.bind("mouseenter.wijmenuEvent",function(d){if(c.disabled||a(this).hasClass("ui-state-disabled"))return;clearTimeout(i);l=setTimeout(function(){b._displaySubmenu(d)},c.showDelay)}).bind("mouseleave"+f,function(){if(c.disabled||a(this).hasClass("ui-state-disabled"))return;clearTimeout(l);if(!g.is("ul"))g=g.children("ul:first");i=setTimeout(function(){b._hideSubmenu()},c.hideDelay)});b.getItems().length>0&&b._getSublist().bind("mouseenter"+f,function(){if(c.disabled)return;clearTimeout(i)})}}d.bind("click.wijmenuEvent",function(g){h=d.hasClass("ui-state-disabled");if(c.disabled||h)return;if(d.is("a")){if(b._getSublist().length===0)e._hideAllMenus();else if(!(c.trigger!==""&&j.data("triggerEvent")!=="default"&&c.triggerEvent!=="mouseenter"))e._hideAllMenus();else{var f=e._currentMenuList,i,a;if(f!==undefined){i=j;if(b._getSublist().length===0)for(a=f.length;a>0;a--)if(f[a-1]===b)break;else f[a-1]._hideSubmenu()}}e.activate(g,b)}e.select(g);d.attr("href")==="#"&&g.preventDefault()}).bind("focusin.wijmenuEvent",function(a){h=d.hasClass("ui-state-disabled");if(c.disabled||h)return;d.is("a")&&e.activate(a,b)});a.each(b.getItems(),function(){this._flyout()})},_hideSubmenu:function(j){var e=this,c=e._getMenu(),i=c.options,k=a.wijmo.wijmenu.animations,g,h,d,b=e._getSublist(),f=e._getLink();if(f.is(".wijmo-wijmenu-link")){f.data("subMenuOpened",false);f.removeClass("ui-state-active")}if(a.fn.wijhide&&j!==true){g={context:b,show:false};h=a.extend({},i.animation,i.hideAnimation);b.wijhide(h,k,g,null,function(){c._setZindex(b);b.attr("aria-hidden",true)})}else{b.hide().attr("aria-hidden",true);c._setZindex(b)}c.element.data("shown",false);d=c._currentMenuList;if(d){d=a.map(d,function(a){return a&&a===e?null:a});c._currentMenuList=a.makeArray(d)}},_displaySubmenu:function(l,j){var c=this,b=c._getMenu(),e=b.options,h,f,i,g,k=c._getLink(),d=c._getSublist();g=!a.wijmo.wijmenu._hasVisibleSubMenus(c);if(d.is(":visible")||g)return;k.is("a.wijmo-wijmenu-link")&&k.data("subMenuOpened",true);d.show();this._setMenuItemPosition();b.nowIndex++;b._setZindex(d,b.nowIndex);d.hide();b._trigger("showing",l,c);h={context:d,show:true};f=e.direction==="rtl"?"right":"left";if(e.orientation==="horizontal")if(c._isRoot())f="up";i=a.extend({},{option:{direction:f}},e.animation,e.showAnimation);a.wijmo.wijmenu._animateFlyoutMenu(i,h,function(){d.is(":hidden")&&c._hideSubmenu(true);j&&j()});b._isClickToOpen=e.triggerEvent==="click";if(b._currentMenuList===undefined)b._currentMenuList=[];b._currentMenuList.push(c)},_setMenuItemPosition:function(){var c=this,b=c._getSublist(),d=c._getMenuItemPosition(),e={of:this._getLink()};b.css({left:"0",top:"0",position:"absolute"});b.position(a.extend(e,d))},_getMenuItemPosition:function(){var f=this,e=this._getMenu(),c=e.options,d=c.direction,b=d==="rtl"?{my:"right top",at:"left top"}:{my:"left top",at:"right top"};if(c.orientation==="horizontal")if(f._isRoot())b=d==="rtl"?{my:"right top",at:"right bottom"}:{my:"left top",at:"left bottom"};b=a.extend(b,c.position);return b},_getChildren:function(){return this._getSublist().children("li")},_setDrilldownUlStyle:function(){var d=this,c=d._getSublist(),e=d._getMenu(),b=e.domObject.menucontainer.width();if(e.options.direction==="rtl")c.css({width:b,left:-b});else c.css({width:b,left:b});c.addClass("ui-widget-content");a.each(d.getItems(),function(b,a){a.getItems().length&&this._setDrilldownUlStyle()})},_getMenu:function(){var d=this,c=d._menu,b,e;if(!c){b=d.element.parent();while(!b.is("body")&&b.length>0){e=b.data(a.wijmo.wijmenu._menuWidgetName);if(e){c=e;d._menu=c;return c}b=b.parent()}throw"An menuitem must be a child of menu";}return c},getParent:function(){var c=this,f=c.element,e,b,d;b=c._parent;if(b!==undefined)return b;d=f.parents("li:first");if(d.length>0){b=a.wijmo.wijmenu._getItemWidget(d);if(b!==undefined){c._parent=b;return b}}e=c._getMenu();if(e._getSublist().get(0)===f.parent().get(0)){c._parent=null;return null}throw"An menuitem must be a child of menu or another menuitem";},_getParentOrMenu:function(){return this.getParent()||this._getMenu()},_getField:function(a){return this.element.data(a)},_setField:function(b,a){return this.element.data(b,a)},_destroy:function(f){var d=this,c=d.element,e;c.removeClass("ui-widget "+b+" ui-state-default ui-corner-all wijmo-wijmenu-parent ui-widget-header wijmo-wijmenu-separator");e=c.children(".wijmo-wijmenu-link");e.removeClass("wijmo-wijmenu-link ui-corner-all ui-state-focus ui-state-hover ui-state-active").html(e.children(".wijmo-wijmenu-text").html()).unbind(".wijmenuitem").unbind(".wijmenuEvent");c.children("ul").removeClass("wijmo-wijmenu-list ui-widget-content ui-corner-all ui-helper-clearfix wijmo-wijmenu-child ui-helper-reset").attr("role","").attr("aria-activedescendant","").show().css({left:"",top:"",position:""}).attr("hidden","");c.removeAttr("role");e.removeAttr("aria-haspopup");!f&&d._removeFromParentCollection();c.removeData("menu").removeData("parent");a.each(d.getItems()||[],function(b,a){a.destroy(true)});d._items.length=0;d._resetMarkupValue()},destroy:function(c){var b=this;b._destroy(c);a.Widget.prototype.destroy.apply(b)},_getFirstSelectableSubItem:function(){return a.wijmo.wijmenu._getFirstSelectableSubItem(this)},_getLastSelectableSubItem:function(){return a.wijmo.wijmenu._getLastSelectableSubItem(this)},next:function(){var f=this,c=f._getParentOrMenu().getItems(),b,d,e=a.inArray(f,c);if(e===-1)throw"cannot find item from the parent collection";for(b=e+1;b<c.length;b++){d=c[b].options;if(d.displayVisible!==false&&!d.header&&!d.separator)return c[b].element}return null},previous:function(){var f=this,d=f._getParentOrMenu().getItems(),b,c,e=a.inArray(f,d);if(e===-1)throw"cannot find item from the parent collection";for(b=e-1;b>=0;b--){c=d[b].options;if(c.displayVisible!==false&&!c.header&&!c.separator)return d[b].element}return null},_removeFromParentCollection:function(){var d=this,b,e=false,c;b=d.getParent();if(b===null){b=d._getMenu();e=true}c=a.inArray(d,b.getItems());if(c===-1)return;a.wijmo.wijmenu._changeCollection(c,b.getItems());if(b.getItems().length===0){!e&&b._setSubmenuIcon(false);b.element.children("ul").remove()}},_resetMarkupValue:function(){this._sublist=null;this._link=null},_hideCurrentSubmenu:function(){var b=this,c=b._getSublist();if(c.length===0)return;!c.data("notClose")&&b._hideSubmenu();a.each(b.getItems(),function(){this._hideCurrentSubmenu()})},_showFlyoutSubmenu:function(f,d){var c=this,e=this._getMenu(),b=e._currentMenuList,a;if(b!==undefined)for(a=b.length;a>0;a--)if(b[a-1]===c.getParent())break;else b[a-1]._hideSubmenu();c._displaySubmenu(f,d)},getItems:function(){return this._items},_getSublist:function(){var a=this;if(!a._sublist)a._sublist=this.element.children("ul:first");return a._sublist},_getLink:function(){var a=this;if(!a._link)a._link=this.element.children(":first");return a._link},_isRoot:function(){return this.getParent()===null},add:function(b,c){a.wijmo.wijmenu._add(this,b,c)},remove:function(b){a.wijmo.wijmenu._remove(this,b)}});a.extend(a.wijmo.wijmenu,{animations:{slide:function(b,c){b=a.extend({duration:400,easing:"swing"},b,c);if(b.show)b.context.stop(true,true).animate({height:"show"},b).attr("aria-hidden",false);else b.context.stop(true,true).animate({height:"hide"},b).attr("aria-hidden",true)}},_animateFlyoutMenu:function(e,c,d){var b=c.context;if(a.fn.wijshow)b.wijshow(e,a.wijmo.wijmenuanimations,c,null,function(){var c=a.browser;if(c.msie&&c.version==="9.0"){b.wrap("<div></div>");b.unwrap()}else c.msie&&c.version==="6.0"&&b.css("overflow","");b.attr("aria-hidden",false);d&&d()});else b.show().attr("aria-hidden",false)},_getMenuItemOptions:function(b,c){return!b?{}:!b.items||!a.isArray(b.items)?{}:c>=b.items.length?{}:b.items[c]},_getOuterElement:function(c,b){return a(c).filter(function(){return a(this).closest(b).length===0})},_hasVisibleSubMenus:function(b){var c,d,e;if(b.jquery)c=b.data(a.wijmo.wijmenu._itemWidgetName)||b.data(a.wijmo.wijmenu._menuWidgetName);else c=b;if(!c)throw"the arugment 'menuItem' must be an wijmenu or wijmenuitem";d=c.getItems();if(!d.length)return false;for(e=0;e<d.length;e++)if(d[e].options.displayVisible)return true;return false},_getFirstSelectableSubItem:function(d){for(var c=d.getItems(),b,a=0;a<c.length;a++){b=c[a].options;if(b.displayVisible!==false&&!b.header&&!b.separator)return c[a]}return null},_getLastSelectableSubItem:function(d){for(var c=d.getItems(),b,a=c.length-1;a>=0;a--){b=c[a].options;if(b.displayVisible!==false&&!b.header&&!b.separator)return c[a]}return null},_getSelectableSubItems:function(c,b){return a.grep(c.getItems(),function(c,d){var a=c.options;return a.header||a.separator||a.displayVisible===false?false:b(c,d)})},_add:function(d,e,b){var c=null,h=a("<li></li>"),g=d._getSublist(),f=d.getItems(),j,k,i=false;if(typeof e==="string")/<(h[1-5]|a)>[\s\S]*<\/\1>/.test(e)&&h.append(e);else if(a.isPlainObject(e))k=e;if(!g||g.length<=0){g=a("<ul></ul>");d.element.append(g);i=true}if(!b||isNaN(b)||b>f.length)if(b!==0)b=f.length;if(f.length>0&&f.length!==b){j=f[b].element;h.insertBefore(j)}else g.append(h);c=d._createItemWidget(h,k);if(c===null||c===undefined)return;a.wijmo.wijmenu._changeCollection(b,d.getItems(),c);if(d._bindModeEvents)d._bindModeEvents(c,i);else c._bindModeEvents(c,i)},_itemWidgetName:"wijmenuitem",_menuWidgetName:"wijmenu",_changeCollection:function(c,b,a){if(!a){b.splice(c,1);return}b.splice(c,0,a)},_remove:function(c,b){var a=c.getItems()[b];a&&a.element&&a.element.remove()},_getItemWidget:function(b){return b.data(a.wijmo.wijmenu._itemWidgetName)}})})(jQuery);
(function(a){"use strict";var e=0,d=0;function c(){return++e}function b(){return++d}a.widget("wijmo.wijtabs",{options:{alignment:"top",sortable:false,scrollable:false,ajaxOptions:null,cache:false,cookie:null,collapsible:false,hideOption:null,showOption:null,disabledIndexes:[],event:"click",idPrefix:"ui-tabs-",panelTemplate:"",spinner:"",tabTemplate:"",add:null,remove:null,select:null,beforeShow:null,show:null,load:null,disable:null,enable:null},_defaults:{panelTemplate:"<div></div>",spinner:"<em>Loading&#8230;</em>",tabTemplate:'<li><a href="#{href}"><span>#{label}</span></a></li>'},_create:function(){var b=this;if(window.wijmoApplyWijTouchUtilEvents)a=window.wijmoApplyWijTouchUtilEvents(a);b.element.is(":hidden")&&b.element.wijAddVisibilityObserver&&b.element.wijAddVisibilityObserver(function(){b.destroy();b._tabify(true);b.element.wijRemoveVisibilityObserver&&b.element.wijRemoveVisibilityObserver()},"wijtabs");b._tabify(true)},_setOption:function(c,b){a.Widget.prototype._setOption.apply(this,arguments);switch(c){case"selected":if(this.options.collapsible&&b===this.options.selected)return;this.select(b);break;case"alignment":this.destroy();this._tabify(true);break;default:this._tabify()}},_initScroller:function(){var c=a.inArray(this._getAlignment(),["top","bottom"])!==-1,b=0;if(!c)return;this.lis.each(function(){b+=a(this).outerWidth(true)});if(!!this.options.scrollable&&this.element.innerWidth()<b){if(this.scrollWrap===undefined){this.list.wrap("<div class='scrollWrap'></div>");this.scrollWrap=this.list.parent();a.effects.save(this.list,["width","height","overflow"])}this.list.width(b+2);this.scrollWrap.height(this.list.outerHeight(true));this.scrollWrap.wijsuperpanel({allowResize:false,hScroller:{scrollMode:"edge"},vScroller:{scrollBarVisibility:"hidden"}})}else this._removeScroller()},_removeScroller:function(){if(this.scrollWrap){this.scrollWrap.wijsuperpanel("destroy").replaceWith(this.scrollWrap.contents());this.scrollWrap=undefined;a.effects.restore(this.list,["width","height","overflow"])}},_tabId:function(e){var b=a(e),d;if(b.data&&b.data("tabid"))return b.data("tabid");d=e.title&&e.title.replace(/\s/g,"_").replace(/[^A-Za-z0-9\-_:\.]/g,"")||this.options.idPrefix+c();b.data("tabid",d);return d},_sanitizeSelector:function(a){return a.replace(/:/g,"\\:")},_cookie:function(){var c=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+b());return a.cookie.apply(null,[c].concat(a.makeArray(arguments)))},_ui:function(a,b){return{tab:a,panel:b,index:this.anchors.index(a)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=a(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_getAlignment:function(b){b=b===undefined?true:b;var a=this.options.alignment||"top";if(b)return a;switch(a){case"top":a="bottom";break;case"bottom":a="top";break;case"left":a="right";break;case"right":a="left"}return a},_saveLayout:function(){var b=["width","height","overflow"],c=this.panels.filter(":not(.ui-tabs-hide)");a.effects.save(this.element,b);a.effects.save(this.list,b);a.effects.save(this.element.find(".wijmo-wijtabs-content"),b);this.list.width(this.list.width());this.element.data("panel.width",c.width());this.element.data("panel.outerWidth",c.outerWidth(true))},_restoreLayout:function(){var b=["width","height","overflow"];a.effects.restore(this.element,b);a.effects.restore(this.list,b);a.effects.restore(this.element.find(".wijmo-wijtabs-content"),b)},_hideContent:function(){var a=this.element.find(".wijmo-wijtabs-content");if(a.length){this._saveLayout();a.addClass("ui-tabs-hide").attr("aria-hidden",true);this.element.width(this.list.outerWidth(true))}},_showContent:function(){var a=this.element.find(".wijmo-wijtabs-content");if(a.length){this._restoreLayout();a.removeClass("ui-tabs-hide").attr("aria-hidden",false)}},_blindPanel:function(b,c){var j=this.options,h=b.parent(".wijmo-wijtabs-content"),k=["position","top","left","width"],f=c==="show"?j.showOption:j.hideOption,e,i,g,d=this;if(!h.length)return;this.list.width(this.list.width());a.effects.save(b,k);b.show();if(c==="show"){b.removeClass("ui-tabs-hide").attr("aria-hidden",false);b.width(this.element.data("panel.width"))}else b.width(b.width());e=a.effects.createWrapper(b).css({overflow:"hidden"});c==="show"&&e.css(a.extend({width:0},f.fade?{opacity:0}:{}));i=a.extend({width:c==="show"?this.element.data("panel.outerWidth"):0},f.fade?{opacity:c==="show"?1:0}:{});g=this.list.outerWidth(true);e.animate(i,{duration:f.duration,step:function(){var a=e.outerWidth(true);d.element.width(g+a);h.width(Math.max(0,d.element.innerWidth()-g-6))},complete:function(){if(c==="hide"){d.lis.removeClass("ui-tabs-selected ui-state-active").attr("aria-selected",false);b.addClass("ui-tabs-hide").attr("aria-hidden",true)}else b.css("width","");a.effects.removeWrapper(b);c==="show"&&d._restoreLayout();d._resetStyle(b);b.dequeue();d.element.dequeue("tabs")}})},_resetStyle:function(b){b.css({display:""});!a.support.opacity&&b[0].style.removeAttribute("filter")},_normalizeBlindOption:function(a){if(a.blind===undefined)a.blind=false;if(a.fade===undefined)a.fade=false;if(a.duration===undefined)a.duration=200;if(typeof a.duration==="string")try{a.duration=parseInt(a.duration,10)}catch(b){a.duration=200}},_tabify:function(n){this.list=this.element.children("ol,ul").eq(0);this.lis=a("li:has(a)",this.list);this.anchors=this.lis.map(function(){return a("a",this)[0]});this.panels=a([]);var c=this,b=this.options,m=/^#.+/,d,l,f,g,e,i,h,k,j;this.anchors.each(function(j,e){var d=a(e).attr("href")||"",h=d.split("#")[0],i,g,f;if(h&&(h===location.toString().split("#")[0]||(i=a("base")[0])&&h===i.href)){d=e.hash;e.href=d}if(m.test(d))c.panels=c.panels.add(c._sanitizeSelector(d),c.element);else if(d!=="#"){a.data(e,"href.tabs",d);a.data(e,"load.tabs",d.replace(/#.*$/,""));g=c._tabId(e);e.href="#"+g;f=a("#"+g);if(!f.length){f=a(b.panelTemplate||c._defaults.panelTemplate).attr("id",g).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(c.panels[j-1]||c.list);f.data("destroy.tabs",true)}c.panels=c.panels.add(f)}else b.disabledIndexes.push(j)});d=this._getAlignment();l=this._getAlignment(false);if(n){this.list.attr("role","tablist");this.lis.attr("role","tab");this.panels.attr("role","tabpanel");this.element.addClass("ui-tabs wijmo-wijtabs ui-tabs-"+d+" ui-widget ui-widget-content ui-corner-all ui-helper-clearfix");this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-"+d);this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-"+l);switch(d){case"bottom":this.list.appendTo(this.element);break;case"left":f=a("<div/>").addClass("wijmo-wijtabs-content").appendTo(this.element);this.panels.appendTo(f);break;case"right":f=a("<div/>").addClass("wijmo-wijtabs-content").insertBefore(this.list);this.panels.appendTo(f);break;case"top":this.list.prependTo(this.element)}b.sortable&&this.list.sortable({axis:d==="top"||d==="bottom"?"x":"y"});if(b.selected===undefined){location.hash&&this.anchors.each(function(c,a){if(a.hash===location.hash){b.selected=c;return false}});if(typeof b.selected!=="number"&&b.cookie)b.selected=parseInt(c._cookie(),10);if(typeof b.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)b.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));b.selected=b.selected||(this.lis.length?0:-1)}else if(b.selected===null)b.selected=-1;b.selected=b.selected>=0&&this.anchors[b.selected]||b.selected<0?b.selected:0;b.disabledIndexes=a.unique(b.disabledIndexes.concat(a.map(this.lis.filter(".ui-state-disabled"),function(a){return c.lis.index(a)}))).sort();a.inArray(b.selected,b.disabledIndexes)!==-1&&b.disabledIndexes.splice(a.inArray(b.selected,b.disabledIndexes),1);this.panels.addClass("ui-tabs-hide").attr("aria-hidden",true);this.lis.removeClass("ui-tabs-selected ui-state-active").attr("aria-selected",false);if(b.selected>=0&&this.anchors.length){this.panels.eq(b.selected).removeClass("ui-tabs-hide").attr("aria-hidden",false);this.lis.eq(b.selected).addClass("ui-tabs-selected ui-state-active").attr("aria-selected",true);c.element.queue("tabs",function(){c.element.wijTriggerVisibility&&a(c.panels[b.selected]).wijTriggerVisibility();c._trigger("show",null,c._ui(c.anchors[b.selected],c.panels[b.selected]))});this.load(b.selected)}a(window).bind("unload",function(){c.lis&&c.lis.add(c.anchors).unbind(".tabs");c.lis=c.anchors=c.panels=null})}else b.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));this.element[b.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");b.cookie&&this._cookie(b.selected,b.cookie);for(g=0;e=this.lis[g];g++){a(e)[a.inArray(g,b.disabledIndexes)!==-1&&!a(e).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");a(e).hasClass("ui-state-disabled")&&a(e).attr("aria-disabled",true)}b.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(!b.disabledState&&b.event!=="mouseover"){i=function(b,a){a.is(":not(.ui-state-disabled)")&&a.addClass("ui-state-"+b)};h=function(a,b){b.removeClass("ui-state-"+a)};this.lis.bind("mouseover.tabs",function(){i("hover",a(this))});this.lis.bind("mouseout.tabs",function(){h("hover",a(this))});this.anchors.bind("focus.tabs",function(){i("focus",a(this).closest("li"))});this.anchors.bind("blur.tabs",function(){h("focus",a(this).closest("li"))})}if(b.showOption===undefined||b.showOption===null)b.showOption={};this._normalizeBlindOption(b.showOption);if(b.hideOption===undefined||b.hideOption===null)b.hideOption={};this._normalizeBlindOption(b.hideOption);k=(b.showOption.blind||b.showOption.fade)&&b.showOption.duration>0?function(g,e){a(g).closest("li").addClass("ui-tabs-selected ui-state-active").attr("aria-selected",true);c._showContent();e.removeClass("ui-tabs-hide").attr("aria-hidden",false);if(d==="top"||d==="bottom"){var f={duration:b.showOption.duration};if(b.showOption.blind)f.height="toggle";if(b.showOption.fade)f.opacity="toggle";e.hide().removeClass("ui-tabs-hide").attr("aria-hidden",false).animate(f,b.showOption.duration||"normal",function(){c._resetStyle(e);e.wijTriggerVisibility&&e.wijTriggerVisibility();c._trigger("show",null,c._ui(g,e[0]))})}else{c._showContent();c._blindPanel(e,"show")}}:function(d,b){a(d).closest("li").addClass("ui-tabs-selected ui-state-active").attr("aria-selected",true);c._showContent();b.removeClass("ui-tabs-hide").attr("aria-hidden",false);b.wijTriggerVisibility&&b.wijTriggerVisibility();c._trigger("show",null,c._ui(d,b[0]))};j=(b.hideOption.blind||b.hideOption.fade)&&b.hideOption.duration>0?function(f,a){if(d==="top"||d==="bottom"){var e={duration:b.hideOption.duration};if(b.hideOption.blind)e.height="toggle";if(b.hideOption.fade)e.opacity="toggle";a.animate(e,b.hideOption.duration||"normal",function(){c.lis.removeClass("ui-tabs-selected ui-state-active").attr("aria-selected",false);a.addClass("ui-tabs-hide").attr("aria-hidden",true);c._resetStyle(a);c.element.dequeue("tabs")})}else{c._saveLayout();c._blindPanel(a,"hide")}}:function(b,a){c.lis.removeClass("ui-tabs-selected ui-state-active").attr("aria-selected",false);c._hideContent();a.addClass("ui-tabs-hide").attr("aria-hidden",true);c.element.dequeue("tabs")};!b.disabledState&&this.anchors.bind(b.event+".tabs",function(){var g=this,f=a(this).closest("li"),d=c.panels.filter(":not(.ui-tabs-hide)"),e=a(c._sanitizeSelector(this.hash),c.element);if(f.hasClass("ui-tabs-selected")&&!b.collapsible||f.hasClass("ui-state-disabled")||f.hasClass("ui-state-processing")||c._trigger("select",null,c._ui(this,e[0]))===false){this.blur();return false}b.selected=c.anchors.index(this);c.abort();if(b.collapsible)if(f.hasClass("ui-tabs-selected")){b.selected=-1;b.cookie&&c._cookie(b.selected,b.cookie);c.element.queue("tabs",function(){j(g,d)}).dequeue("tabs");this.blur();return false}else if(!d.length){b.cookie&&c._cookie(b.selected,b.cookie);c.element.queue("tabs",function(){k(g,e)});c.load(c.anchors.index(this));this.blur();return false}b.cookie&&c._cookie(b.selected,b.cookie);if(e.length){d.length&&c.element.queue("tabs",function(){j(g,d)});c.element.queue("tabs",function(){k(g,e)});c.load(c.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";a.browser.msie&&this.blur()});this._initScroller();this.anchors.bind("click.tabs",function(){return false})},destroy:function(){var c=this.options,b=a(".wijmo-wijtabs-content");this.abort();this._removeScroller();this.element.unbind(".tabs").removeClass(["wijmo-wijtabs","ui-tabs-top","ui-tabs-bottom","ui-tabs-left","ui-tabs-right","ui-tabs","ui-widget","ui-widget-content","ui-corner-all","ui-tabs-collapsible","ui-helper-clearfix"].join(" ")).removeData("tabs").removeAttr("role");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfixui-widget-header ui-corner-all").removeAttr("role");this.anchors.each(function(){var c=a.data(this,"href.tabs"),b;if(c)this.href=c;b=a(this).unbind(".tabs");a.each(["href","load","cache"],function(c,a){b.removeData(a+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){if(a.data(this,"destroy.tabs"))a(this).remove();else a(this).removeClass(["ui-state-default","ui-corner-top","ui-corner-bottom","ui-corner-left","ui-corner-right","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-tabs-hide"].join(" ")).css({position:"",left:"",top:""}).removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-selected").removeAttr("aria-disabled")});b.length&&b.replaceWith(b.contents());c.cookie&&this._cookie(null,c.cookie);return this},add:function(h,l,b){if(b===undefined)b=this.anchors.length;var c=this,f=this.options,e=a((f.tabTemplate||c._defaults.tabTemplate).replace(/#\{href\}/g,h).replace(/#\{label\}/g,l)),i=!h.indexOf("#")?h.replace("#",""):this._tabId(a("a",e)[0]),k=this._getAlignment(),j=this._getAlignment(false),d=a("#"+i),g;e.addClass("ui-state-default ui-corner-"+k).data("destroy.tabs",true).attr("role","tab").attr("aria-selected",false);if(!d.length)d=a(f.panelTemplate||c._defaults.panelTemplate).attr("id",i).data("destroy.tabs",true).attr("role","tabpanel");d.addClass("ui-tabs-panel ui-widget-content ui-corner-"+j+" ui-tabs-hide").attr("aria-hidden",true);if(b>=this.lis.length){e.appendTo(this.list);if(this.panels.length>0)d.insertAfter(this.panels[this.panels.length-1]);else{g=this.element.find(".wijmo-wijtabs-content");if(g.length===0)g=this.element;d.appendTo(g)}}else{e.insertBefore(this.lis[b]);d.insertBefore(this.panels[b])}f.disabledIndexes=a.map(f.disabledIndexes,function(a){return a>=b?++a:a});this._removeScroller();this._tabify();if(this.anchors.length===1){f.selected=0;e.addClass("ui-tabs-selected ui-state-active").attr("aria-selected",true);d.removeClass("ui-tabs-hide").attr("aria-hidden",false);this.element.queue("tabs",function(){c.element.wijTriggerVisibility&&a(c.panels[0]).wijTriggerVisibility();c._trigger("show",null,c._ui(c.anchors[0],c.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[b],this.panels[b]));return this},remove:function(b){var d=this.options,c=this.lis.eq(b).remove(),e=this.panels.eq(b).remove();c.hasClass("ui-tabs-selected")&&this.anchors.length>1&&this.select(b+(b+1<this.anchors.length?1:-1));d.disabledIndexes=a.map(a.grep(d.disabledIndexes,function(a){return a!==b}),function(a){return a>=b?--a:a});this._removeScroller();this._tabify();this._trigger("remove",null,this._ui(c.find("a")[0],e[0]));return this},enableTab:function(b){var c=this.options;if(a.inArray(b,c.disabledIndexes)===-1)return;this.lis.eq(b).removeClass("ui-state-disabled").removeAttr("aria-disabled");c.disabledIndexes=a.grep(c.disabledIndexes,function(a){return a!==b});this._trigger("enable",null,this._ui(this.anchors[b],this.panels[b]));return this},disableTab:function(a){var b=this.options;if(a!==b.selected){this.lis.eq(a).addClass("ui-state-disabled").attr("aria-disabled",true);b.disabledIndexes.push(a);b.disabledIndexes.sort();this._trigger("disable",null,this._ui(this.anchors[a],this.panels[a]))}return this},select:function(a){if(typeof a==="string")a=this.anchors.index(this.anchors.filter("[href$="+a+"]"));else if(a===null)a=-1;if(a===-1&&this.options.collapsible)a=this.options.selected;this.anchors.eq(a).trigger(this.options.event+".tabs");return this},load:function(c){var b=this,e=this.options,d=this.anchors.eq(c)[0],g=a.data(d,"load.tabs"),f=a("span",d);this.abort();if(!g||this.element.queue("tabs").length!==0&&a.data(d,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(c).addClass("ui-state-processing");(e.spinner||b._defaults.spinner)&&f.data("label.tabs",f.html()).html(e.spinner||b._defaults.spinner);this.xhr=a.ajax(a.extend({},e.ajaxOptions,{url:g,success:function(f,g){a(b._sanitizeSelector(d.hash),b.element).html(f);b._cleanup();e.cache&&a.data(d,"cache.tabs",true);b._trigger("load",null,b._ui(b.anchors[c],b.panels[c]));try{e.ajaxOptions.success(f,g)}catch(h){}},error:function(a,f){b._cleanup();b._trigger("load",null,b._ui(b.anchors[c],b.panels[c]));try{e.ajaxOptions.error(a,f,c,d)}catch(g){}}}));b.element.dequeue("tabs");return this},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},url:function(a,b){this.anchors.eq(a).removeData("cache.tabs").data("load.tabs",b);return this},length:function(){return this.anchors.length}})})(jQuery);
(function(b){"use strict";var a,c,d,j=false,i=false,h,f,e,g;b.widget("wijmo.wijvideo",{options:{fullScreenButtonVisible:true,showControlsOnHover:true},_create:function(){var i=this,n,k,l,o=i.options,m;if(window.wijmoApplyWijTouchUtilEvents)b=window.wijmoApplyWijTouchUtilEvents(b);if(b(this.element).is("video"))a=b(this.element);else a=b(this.element).find("video");if(!a||a.length===0||b.browser.msie&&b.browser.version<9)return;l=a[0].canPlayType;if(!l)return;a.wrap('<div class="wijmo-wijvideo ui-widget-content ui-widget" />').after('<div class="wijmo-wijvideo-wrapper"><ul class="wijmo-wijvideo-controls ui-widget-header ui-helper-clearfix ui-helper-reset"><li class="wijmo-wijvideo-play ui-state-default ui-corner-all"><span class="ui-icon ui-icon-play"></span></li><li class="wijmo-wijvideo-index"><div class="wijmo-wijvideo-index-slider"></div></li><li class="wijmo-wijvideo-timer">00:00</li><li class="wijmo-wijvideo-volume ui-state-default ui-corner-all"><div class="wijmo-wijvideo-volume-container"><div class="wijmo-wijvideo-volumeslider ui-state-default ui-corner-top"></div></div><span class="ui-icon ui-icon-volume-on"></span></li><li class="wijmo-wijvideo-fullscreen ui-state-default ui-corner-all"><span class="ui-icon ui-icon-arrow-4-diag"></span></li></ul></div>');c=a.parent(".wijmo-wijvideo");c.width(a.outerWidth()).height(a.outerHeight());d=c.find(".wijmo-wijvideo-index-slider");i._volumnOn=true;e=c.find(".wijmo-wijvideo-volume");m=window.setInterval(function(){if(i._getVideoAttribute("readyState")){window.clearInterval(m);c.width(a.outerWidth()).height(a.outerHeight());a.parent().find(".wijmo-wijvideo-controls").show();n=c.find(".wijmo-wijvideo-timer").position().left;d.width(n-d.position().left-15);d.slider({value:0,step:.01,max:i._getVideoAttribute("duration"),range:"min",stop:function(b,a){j=false;i._setVideoAttribute("currentTime",a.value)},slide:function(){j=true}});i._updateTime();f=c.find(".wijmo-wijvideo-volumeslider");f.slider({min:0,max:1,value:i._getVideoAttribute("volume"),step:.1,orientation:"vertical",range:"min",slide:function(b,a){i._setVideoAttribute("volume",a.value);if(a.value===0){i._volumnOn=false;e.find("span").removeClass("ui-icon-volume-on").addClass("ui-icon-volume-off")}else{i._volumnOn=true;e.find("span").removeClass("ui-icon-volume-off").addClass("ui-icon-volume-on")}}});a.parent().find(".wijmo-wijvideo-controls").css("display","none");i._initialToolTip();if(!o.showControlsOnHover){b(".wijmo-wijvideo-controls").show();c.height(a.outerHeight()+b(".wijmo-wijvideo-controls").height())}}},200);a.bind("click."+i.widgetName,function(){i._togglePlay()});o.showControlsOnHover&&b(".wijmo-wijvideo").hover(function(){b(".wijmo-wijvideo-controls").stop(true,true).fadeIn()},function(){b(".wijmo-wijvideo-controls").delay(300).fadeOut()});k=c.find(".wijmo-wijvideo-play > span");k.click(function(){i._togglePlay()}).parent().hover(function(){b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")});c.find(".wijmo-wijvideo-volume").hover(function(){b(".wijmo-wijvideo-volume-container").stop(true,true).slideToggle()});g=c.find(".wijmo-wijvideo-fullscreen > span");g.click(function(){i._toggleFullScreen()}).parent().hover(function(){b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")});!i.options.fullScreenButtonVisible&&c.find(".wijmo-wijvideo-fullscreen").hide();e.hover(function(){b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")}).click(function(){if(i._getVideoAttribute("readyState")){i._volumnOn=!i._volumnOn;if(!i._volumnOn){h=f.slider("value");f.slider("value",0);i._setVideoAttribute("volume",0);e.find("span").removeClass("ui-icon-volume-on").addClass("ui-icon-volume-off")}else{f.slider("value",h);i._setVideoAttribute("volume",h);e.find("span").removeClass("ui-icon-volume-off").addClass("ui-icon-volume-on")}}});a.bind("play."+i.widgetName,function(){k.removeClass("ui-icon ui-icon-play").addClass("ui-icon ui-icon-pause")});a.bind("pause."+i.widgetName,function(){k.removeClass("ui-icon ui-icon-pause").addClass("ui-icon ui-icon-play")});a.bind("ended."+i.widgetName,function(){i.pause()});a.bind("timeupdate."+i.widgetName,function(){i._updateTime()});i._videoIsControls=false;if(i._getVideoAttribute("controls"))i._videoIsControls=true;a.removeAttr("controls");i.element.is(":hidden")&&i.element.wijAddVisibilityObserver&&i.element.wijAddVisibilityObserver(function(){i._refresh();i.element.wijRemoveVisibilityObserver&&i.element.wijRemoveVisibilityObserver()},"wijvideo");i.options.disabled&&i._handleDisabledOption(true,i.element)},_setOption:function(f,d){var e=this,g=e.options;b.Widget.prototype._setOption.apply(e,arguments);if(f==="fullScreenButtonVisible"){g.fullScreenButtonVisible=d;if(d)c.find(".wijmo-wijvideo-fullscreen").show();else c.find(".wijmo-wijvideo-fullscreen").hide()}else if(f==="disabled")e._handleDisabledOption(d,e.element);else if(f==="showControlsOnHover")if(!d){b(".wijmo-wijvideo").unbind("mouseenter mouseleave");window.setTimeout(function(){b(".wijmo-wijvideo-controls").show();c.height(a.outerHeight()+b(".wijmo-wijvideo-controls").height())},200)}else{c.height(a.outerHeight());b(".wijmo-wijvideo-controls").hide();b(".wijmo-wijvideo").hover(function(){b(".wijmo-wijvideo-controls").stop(true,true).fadeIn()},function(){b(".wijmo-wijvideo-controls").delay(300).fadeOut()})}},_handleDisabledOption:function(d,e){var c=this;if(d){if(!c.disabledDiv)c.disabledDiv=c._createDisabledDiv(e);c.disabledDiv.appendTo("body");if(b.browser.msie){b(".wijmo-wijvideo").unbind("mouseenter mouseleave");a.unbind("click."+c.widgetName)}}else if(c.disabledDiv){c.disabledDiv.remove();c.disabledDiv=null;if(b.browser.msie){b(".wijmo-wijvideo").hover(function(){b(".wijmo-wijvideo-controls").stop(true,true).fadeIn()},function(){b(".wijmo-wijvideo-controls").delay(300).fadeOut()});a.bind("click."+c.widgetName,function(){c._togglePlay()})}}},_createDisabledDiv:function(){var a=c,d=a.offset(),f=a.outerWidth(),e=a.outerHeight();return b("<div></div>").addClass("ui-disabled").css({"z-index":"99999",position:"absolute",width:f,height:e,left:d.left,top:d.top})},_getVideoAttribute:function(b){return b===""?void 0:a.attr(b)!==undefined?a.attr(b):a.prop(b)},_setVideoAttribute:function(b,c){return b===""?void 0:a.attr(b)!==undefined?a.attr(b,c):a.prop(b,c)},_initialToolTip:function(){var a=this;d.wijtooltip({mouseTrailing:true,showCallout:false,position:{offset:"-60 -60"}});d.bind("mousemove",function(b){a._changeToolTipContent(b)});e.wijtooltip({content:"Volume",showCallout:false});g.wijtooltip({content:"Full Screen",showCallout:false});d.wijtooltip("widget").addClass("wijmo-wijvideo");e.wijtooltip("widget").addClass("wijmo-wijvideo");e.wijtooltip("widget").addClass("wijmo-wijvideo")},_updateTime:function(){var g=this,i=g._getVideoAttribute("duration"),b=g._getVideoAttribute("currentTime"),a,e,f="",h="";a=this._truncate((i-b)/60);e=this._truncate(i-b-a*60);if(a<10)f="0";if(e<10)h="0";c.find(".wijmo-wijvideo-timer").html(f+a+":"+h+e);!j&&d.slider("value",b)},_truncate:function(a){return Math[a>0?"floor":"ceil"](a)},_togglePlay:function(){var a=this;if(!a._getVideoAttribute("readyState"))return;if(a._getVideoAttribute("paused"))this.play();else this.pause()},_toggleFullScreen:function(){var d=this,h=d._getVideoAttribute("paused"),e=0,f=b(window).width(),g=b(window).height();i=!i;if(i){d._oriVidParentStyle=c.attr("style");d._oriWidth=a.outerWidth();d._oriHeight=a.outerHeight();d._oriDocOverFlow=b(document.documentElement).css("overflow");b(document.documentElement).css({overflow:"hidden"});if(!d._replacedDiv)d._replacedDiv=b("<div />");c.after(d._replacedDiv);c.addClass("wijmo-wijvideo-container-fullscreen").css({width:f,height:g}).appendTo(b("body"));a.attr("width",f).attr("height",g);b(window).bind("resize.wijvideo",function(){d._fullscreenOnWindowResize()});e=f-d._oriWidth}else{b(document.documentElement).css({overflow:d._oriDocOverFlow});e=d._oriWidth-a.width();d._replacedDiv.after(c).remove();c.removeClass("wijmo-wijvideo-container-fullscreen").attr("style","").attr("style",d._oriVidParentStyle);a.attr("width",d._oriWidth).attr("height",d._oriHeight);b(window).unbind("resize.wijvideo")}d._positionControls(e);d._hideToolTips();if(!h)d.play();else d.pause()},_fullscreenOnWindowResize:function(){var g=this,d=b(window).width(),e=b(window).height(),f=d-c.width();c.css({width:d,height:e});a.attr("width",d).attr("height",e);g._positionControls(f)},_positionControls:function(b){var a=c.find(".wijmo-wijvideo-index-slider");a.width(a.width()+b)},_showToolTip:function(e){var c=this,a=e.pageX,f=e.pageY,g=d.offset().left,h=d.width(),i=a-g,j=c._getVideoAttribute("duration"),b;b=j*(i/h);d.wijtooltip("option","content",c._getToolTipContent(b));d.wijtooltip("showAt",{x:a,y:f-10})},_changeToolTipContent:function(i){var b=this,c=i.pageX,e=d.offset().left,f=d.width(),g=c-e,h=b._getVideoAttribute("duration"),a;a=h*(g/f);d.wijtooltip("option","content",b._getToolTipContent(a))},_hideToolTips:function(){d.wijtooltip("hide");e.wijtooltip("hide");g.wijtooltip("hide")},_getToolTipContent:function(c){var a,b,d="",e="";a=parseInt(c/60,10);b=parseInt(c-a*60,10);if(a<10)d="0";if(b<10)e="0";return d+a+":"+e+b},_refresh:function(){var e;a.parent().find(".wijmo-wijvideo-controls").show();e=c.find(".wijmo-wijvideo-timer").position().left;d.width(e-d.position().left-15);a.parent().find(".wijmo-wijvideo-controls").css("display","none");if(!this.options.showControlsOnHover){b(".wijmo-wijvideo-controls",c).show();c.height(a.outerHeight()+b(".wijmo-wijvideo-controls").height())}},destroy:function(){var d=this;b.Widget.prototype.destroy.apply(this,arguments);c.after(a).remove();a.unbind("."+d.widgetName);d._videoIsControls&&d._setVideoAttribute("controls",true)},play:function(){a[0].play()},pause:function(){a[0].pause()},getWidth:function(){return a.outerWidth()},setWidth:function(b){b=b||600;var d=this.getWidth();a.attr("width",b);c.width(a.outerWidth());this._positionControls(this.getWidth()-d)},getHeight:function(){return a.outerHeight()},setHeight:function(d){d=d||400;a.attr("height",d);if(this.options.showControlsOnHover)c.height(a.outerHeight());else c.height(a.outerHeight()+b(".wijmo-wijvideo-controls").height())}})})(jQuery);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//











;
