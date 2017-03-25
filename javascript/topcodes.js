(function(){var supportsDirectProtoAccess=function(){var z=function(){}
z.prototype={p:{}}
var y=new z()
if(!(y.__proto__&&y.__proto__.p===z.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var x=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(x))return true}}catch(w){}return false}()
function map(a){a=Object.create(null)
a.x=0
delete a.x
return a}var A=map()
var B=map()
var C=map()
var D=map()
var E=map()
var F=map()
var G=map()
var H=map()
var J=map()
var K=map()
var L=map()
var M=map()
var N=map()
var O=map()
var P=map()
var Q=map()
var R=map()
var S=map()
var T=map()
var U=map()
var V=map()
var W=map()
var X=map()
var Y=map()
var Z=map()
function I(){}init()
function setupProgram(a,b){"use strict"
function generateAccessor(a9,b0,b1){var g=a9.split("-")
var f=g[0]
var e=f.length
var d=f.charCodeAt(e-1)
var c
if(g.length>1)c=true
else c=false
d=d>=60&&d<=64?d-59:d>=123&&d<=126?d-117:d>=37&&d<=43?d-27:0
if(d){var a0=d&3
var a1=d>>2
var a2=f=f.substring(0,e-1)
var a3=f.indexOf(":")
if(a3>0){a2=f.substring(0,a3)
f=f.substring(a3+1)}if(a0){var a4=a0&2?"r":""
var a5=a0&1?"this":"r"
var a6="return "+a5+"."+f
var a7=b1+".prototype.g"+a2+"="
var a8="function("+a4+"){"+a6+"}"
if(c)b0.push(a7+"$reflectable("+a8+");\n")
else b0.push(a7+a8+";\n")}if(a1){var a4=a1&2?"r,v":"v"
var a5=a1&1?"this":"r"
var a6=a5+"."+f+"=v"
var a7=b1+".prototype.s"+a2+"="
var a8="function("+a4+"){"+a6+"}"
if(c)b0.push(a7+"$reflectable("+a8+");\n")
else b0.push(a7+a8+";\n")}}return f}function defineClass(a2,a3){var g=[]
var f="function "+a2+"("
var e=""
var d=""
for(var c=0;c<a3.length;c++){if(c!=0)f+=", "
var a0=generateAccessor(a3[c],g,a2)
d+="'"+a0+"',"
var a1="p_"+a0
f+=a1
e+="this."+a0+" = "+a1+";\n"}if(supportsDirectProtoAccess)e+="this."+"$deferredAction"+"();"
f+=") {\n"+e+"}\n"
f+=a2+".builtin$cls=\""+a2+"\";\n"
f+="$desc=$collectedClasses."+a2+"[1];\n"
f+=a2+".prototype = $desc;\n"
if(typeof defineClass.name!="string")f+=a2+".name=\""+a2+"\";\n"
f+=a2+"."+"$__fields__"+"=["+d+"];\n"
f+=g.join("")
return f}init.createNewIsolate=function(){return new I()}
init.classIdExtractor=function(c){return c.constructor.name}
init.classFieldsExtractor=function(c){var g=c.constructor.$__fields__
if(!g)return[]
var f=[]
f.length=g.length
for(var e=0;e<g.length;e++)f[e]=c[g[e]]
return f}
init.instanceFromClassId=function(c){return new init.allClasses[c]()}
init.initializeEmptyInstance=function(c,d,e){init.allClasses[c].apply(d,e)
return d}
var z=supportsDirectProtoAccess?function(c,d){var g=c.prototype
g.__proto__=d.prototype
g.constructor=c
g["$is"+c.name]=c
return convertToFastObject(g)}:function(){function tmp(){}return function(a0,a1){tmp.prototype=a1.prototype
var g=new tmp()
convertToSlowObject(g)
var f=a0.prototype
var e=Object.keys(f)
for(var d=0;d<e.length;d++){var c=e[d]
g[c]=f[c]}g["$is"+a0.name]=a0
g.constructor=a0
a0.prototype=g
return g}}()
function finishClasses(a4){var g=init.allClasses
a4.combinedConstructorFunction+="return [\n"+a4.constructorsList.join(",\n  ")+"\n]"
var f=new Function("$collectedClasses",a4.combinedConstructorFunction)(a4.collected)
a4.combinedConstructorFunction=null
for(var e=0;e<f.length;e++){var d=f[e]
var c=d.name
var a0=a4.collected[c]
var a1=a0[0]
a0=a0[1]
g[c]=d
a1[c]=d}f=null
var a2=init.finishedClasses
function finishClass(c1){if(a2[c1])return
a2[c1]=true
var a5=a4.pending[c1]
if(a5&&a5.indexOf("+")>0){var a6=a5.split("+")
a5=a6[0]
var a7=a6[1]
finishClass(a7)
var a8=g[a7]
var a9=a8.prototype
var b0=g[c1].prototype
var b1=Object.keys(a9)
for(var b2=0;b2<b1.length;b2++){var b3=b1[b2]
if(!u.call(b0,b3))b0[b3]=a9[b3]}}if(!a5||typeof a5!="string"){var b4=g[c1]
var b5=b4.prototype
b5.constructor=b4
b5.$isb=b4
b5.$deferredAction=function(){}
return}finishClass(a5)
var b6=g[a5]
if(!b6)b6=existingIsolateProperties[a5]
var b4=g[c1]
var b5=z(b4,b6)
if(a9)b5.$deferredAction=mixinDeferredActionHelper(a9,b5)
if(Object.prototype.hasOwnProperty.call(b5,"%")){var b7=b5["%"].split(";")
if(b7[0]){var b8=b7[0].split("|")
for(var b2=0;b2<b8.length;b2++){init.interceptorsByTag[b8[b2]]=b4
init.leafTags[b8[b2]]=true}}if(b7[1]){b8=b7[1].split("|")
if(b7[2]){var b9=b7[2].split("|")
for(var b2=0;b2<b9.length;b2++){var c0=g[b9[b2]]
c0.$nativeSuperclassTag=b8[0]}}for(b2=0;b2<b8.length;b2++){init.interceptorsByTag[b8[b2]]=b4
init.leafTags[b8[b2]]=false}}b5.$deferredAction()}if(b5.$isd)b5.$deferredAction()}var a3=Object.keys(a4.pending)
for(var e=0;e<a3.length;e++)finishClass(a3[e])}function finishAddStubsHelper(){var g=this
while(!g.hasOwnProperty("$deferredAction"))g=g.__proto__
delete g.$deferredAction
var f=Object.keys(g)
for(var e=0;e<f.length;e++){var d=f[e]
var c=d.charCodeAt(0)
var a0
if(d!=="^"&&d!=="$reflectable"&&c!==43&&c!==42&&(a0=g[d])!=null&&a0.constructor===Array&&d!=="<>")addStubs(g,a0,d,false,[])}convertToFastObject(g)
g=g.__proto__
g.$deferredAction()}function mixinDeferredActionHelper(c,d){var g
if(d.hasOwnProperty("$deferredAction"))g=d.$deferredAction
return function foo(){if(!supportsDirectProtoAccess)return
var f=this
while(!f.hasOwnProperty("$deferredAction"))f=f.__proto__
if(g)f.$deferredAction=g
else{delete f.$deferredAction
convertToFastObject(f)}c.$deferredAction()
f.$deferredAction()}}function processClassData(b1,b2,b3){b2=convertToSlowObject(b2)
var g
var f=Object.keys(b2)
var e=false
var d=supportsDirectProtoAccess&&b1!="b"
for(var c=0;c<f.length;c++){var a0=f[c]
var a1=a0.charCodeAt(0)
if(a0==="l"){processStatics(init.statics[b1]=b2.l,b3)
delete b2.l}else if(a1===43){w[g]=a0.substring(1)
var a2=b2[a0]
if(a2>0)b2[g].$reflectable=a2}else if(a1===42){b2[g].$defaultValues=b2[a0]
var a3=b2.$methodsWithOptionalArguments
if(!a3)b2.$methodsWithOptionalArguments=a3={}
a3[a0]=g}else{var a4=b2[a0]
if(a0!=="^"&&a4!=null&&a4.constructor===Array&&a0!=="<>")if(d)e=true
else addStubs(b2,a4,a0,false,[])
else g=a0}}if(e)b2.$deferredAction=finishAddStubsHelper
var a5=b2["^"],a6,a7,a8=a5
var a9=a8.split(";")
a8=a9[1]?a9[1].split(","):[]
a7=a9[0]
a6=a7.split(":")
if(a6.length==2){a7=a6[0]
var b0=a6[1]
if(b0)b2.$signature=function(b4){return function(){return init.types[b4]}}(b0)}if(a7)b3.pending[b1]=a7
b3.combinedConstructorFunction+=defineClass(b1,a8)
b3.constructorsList.push(b1)
b3.collected[b1]=[m,b2]
i.push(b1)}function processStatics(a3,a4){var g=Object.keys(a3)
for(var f=0;f<g.length;f++){var e=g[f]
if(e==="^")continue
var d=a3[e]
var c=e.charCodeAt(0)
var a0
if(c===43){v[a0]=e.substring(1)
var a1=a3[e]
if(a1>0)a3[a0].$reflectable=a1
if(d&&d.length)init.typeInformation[a0]=d}else if(c===42){m[a0].$defaultValues=d
var a2=a3.$methodsWithOptionalArguments
if(!a2)a3.$methodsWithOptionalArguments=a2={}
a2[e]=a0}else if(typeof d==="function"){m[a0=e]=d
h.push(e)
init.globalFunctions[e]=d}else if(d.constructor===Array)addStubs(m,d,e,true,h)
else{a0=e
processClassData(e,d,a4)}}}function addStubs(b6,b7,b8,b9,c0){var g=0,f=b7[g],e
if(typeof f=="string")e=b7[++g]
else{e=f
f=b8}var d=[b6[b8]=b6[f]=e]
e.$stubName=b8
c0.push(b8)
for(g++;g<b7.length;g++){e=b7[g]
if(typeof e!="function")break
if(!b9)e.$stubName=b7[++g]
d.push(e)
if(e.$stubName){b6[e.$stubName]=e
c0.push(e.$stubName)}}for(var c=0;c<d.length;g++,c++)d[c].$callName=b7[g]
var a0=b7[g]
b7=b7.slice(++g)
var a1=b7[0]
var a2=a1>>1
var a3=(a1&1)===1
var a4=a1===3
var a5=a1===1
var a6=b7[1]
var a7=a6>>1
var a8=(a6&1)===1
var a9=a2+a7!=d[0].length
var b0=b7[2]
if(typeof b0=="number")b7[2]=b0+b
var b1=2*a7+a2+3
if(a0){e=tearOff(d,b7,b9,b8,a9)
b6[b8].$getter=e
e.$getterStub=true
if(b9){init.globalFunctions[b8]=e
c0.push(a0)}b6[a0]=e
d.push(e)
e.$stubName=a0
e.$callName=null}var b2=b7.length>b1
if(b2){d[0].$reflectable=1
d[0].$reflectionInfo=b7
for(var c=1;c<d.length;c++){d[c].$reflectable=2
d[c].$reflectionInfo=b7}var b3=b9?init.mangledGlobalNames:init.mangledNames
var b4=b7[b1]
var b5=b4
if(a0)b3[a0]=b5
if(a4)b5+="="
else if(!a5)b5+=":"+(a2+a7)
b3[b8]=b5
d[0].$reflectionName=b5
d[0].$metadataIndex=b1+1
if(a7)b6[b4+"*"]=d[0]}}function tearOffGetter(c,d,e,f){return f?new Function("funcs","reflectionInfo","name","H","c","return function tearOff_"+e+y+++"(x) {"+"if (c === null) c = "+"H.bK"+"("+"this, funcs, reflectionInfo, false, [x], name);"+"return new c(this, funcs[0], x, name);"+"}")(c,d,e,H,null):new Function("funcs","reflectionInfo","name","H","c","return function tearOff_"+e+y+++"() {"+"if (c === null) c = "+"H.bK"+"("+"this, funcs, reflectionInfo, false, [], name);"+"return new c(this, funcs[0], null, name);"+"}")(c,d,e,H,null)}function tearOff(c,d,e,f,a0){var g
return e?function(){if(g===void 0)g=H.bK(this,c,d,true,[],f).prototype
return g}:tearOffGetter(c,d,f,a0)}var y=0
if(!init.libraries)init.libraries=[]
if(!init.mangledNames)init.mangledNames=map()
if(!init.mangledGlobalNames)init.mangledGlobalNames=map()
if(!init.statics)init.statics=map()
if(!init.typeInformation)init.typeInformation=map()
if(!init.globalFunctions)init.globalFunctions=map()
var x=init.libraries
var w=init.mangledNames
var v=init.mangledGlobalNames
var u=Object.prototype.hasOwnProperty
var t=a.length
var s=map()
s.collected=map()
s.pending=map()
s.constructorsList=[]
s.combinedConstructorFunction="function $reflectable(fn){fn.$reflectable=1;return fn};\n"+"var $desc;\n"
for(var r=0;r<t;r++){var q=a[r]
var p=q[0]
var o=q[1]
var n=q[2]
var m=q[3]
var l=q[4]
var k=!!q[5]
var j=l&&l["^"]
if(j instanceof Array)j=j[0]
var i=[]
var h=[]
processStatics(l,s)
x.push([p,o,i,h,n,j,k,m])}finishClasses(s)}I.t=function(){}
var dart=[["","",,H,{"^":"",iK:{"^":"b;a"}}],["","",,J,{"^":"",
j:function(a){return void 0},
bh:function(a,b,c,d){return{i:a,p:b,e:c,x:d}},
be:function(a){var z,y,x,w,v
z=a[init.dispatchPropertyName]
if(z==null)if($.bR==null){H.hT()
z=a[init.dispatchPropertyName]}if(z!=null){y=z.p
if(!1===y)return z.i
if(!0===y)return a
x=Object.getPrototypeOf(a)
if(y===x)return z.i
if(z.e===x)throw H.c(new P.cR("Return interceptor for "+H.a(y(a,z))))}w=a.constructor
v=w==null?null:w[$.$get$bo()]
if(v!=null)return v
v=H.i2(a)
if(v!=null)return v
if(typeof a=="function")return C.y
y=Object.getPrototypeOf(a)
if(y==null)return C.m
if(y===Object.prototype)return C.m
if(typeof w=="function"){Object.defineProperty(w,$.$get$bo(),{value:C.e,enumerable:false,writable:true,configurable:true})
return C.e}return C.e},
d:{"^":"b;",
m:function(a,b){return a===b},
gp:function(a){return H.Y(a)},
i:["cu",function(a){return H.b2(a)}],
aS:["ct",function(a,b){throw H.c(P.cl(a,b.gbR(),b.gbW(),b.gbS(),null))}],
"%":"CanvasGradient|CanvasPattern|DOMError|FileError|MediaError|MediaKeyError|NavigatorUserMediaError|PositionError|PushMessageData|SQLError|SVGAnimatedLength|SVGAnimatedLengthList|SVGAnimatedNumber|SVGAnimatedNumberList|SVGAnimatedString|WebGLRenderingContext"},
ew:{"^":"d;",
i:function(a){return String(a)},
gp:function(a){return a?519018:218159},
$ishH:1},
ez:{"^":"d;",
m:function(a,b){return null==b},
i:function(a){return"null"},
gp:function(a){return 0},
aS:function(a,b){return this.ct(a,b)}},
bp:{"^":"d;",
gp:function(a){return 0},
i:["cv",function(a){return String(a)}],
$iseA:1},
eV:{"^":"bp;"},
aK:{"^":"bp;"},
aC:{"^":"bp;",
i:function(a){var z=a[$.$get$aU()]
return z==null?this.cv(a):J.a3(z)},
$isbn:1,
$signature:function(){return{func:1,opt:[,,,,,,,,,,,,,,,,]}}},
az:{"^":"d;$ti",
bI:function(a,b){if(!!a.immutable$list)throw H.c(new P.q(b))},
aN:function(a,b){if(!!a.fixed$length)throw H.c(new P.q(b))},
v:function(a,b){this.aN(a,"add")
a.push(b)},
bD:function(a,b){var z
this.aN(a,"addAll")
for(z=J.aR(b);z.q();)a.push(z.gt())},
a1:function(a,b){return new H.b0(a,b,[null,null])},
dO:function(a,b){var z,y,x,w
z=a.length
y=new Array(z)
y.fixed$length=Array
for(x=0;x<a.length;++x){w=H.a(a[x])
if(x>=z)return H.e(y,x)
y[x]=w}return y.join(b)},
J:function(a,b){if(b<0||b>=a.length)return H.e(a,b)
return a[b]},
gdz:function(a){if(a.length>0)return a[0]
throw H.c(H.cb())},
b1:function(a,b,c,d,e){var z,y,x
this.bI(a,"set range")
P.cw(b,c,a.length,null,null,null)
z=c-b
if(z===0)return
if(e<0)H.p(P.Z(e,0,null,"skipCount",null))
if(e+z>d.length)throw H.c(H.eu())
if(e<b)for(y=z-1;y>=0;--y){x=e+y
if(x<0||x>=d.length)return H.e(d,x)
a[b+y]=d[x]}else for(y=0;y<z;++y){x=e+y
if(x<0||x>=d.length)return H.e(d,x)
a[b+y]=d[x]}},
i:function(a){return P.aZ(a,"[","]")},
gA:function(a){return new J.dS(a,a.length,0,null)},
gp:function(a){return H.Y(a)},
gk:function(a){return a.length},
sk:function(a,b){this.aN(a,"set length")
if(b<0)throw H.c(P.Z(b,0,null,"newLength",null))
a.length=b},
h:function(a,b){if(typeof b!=="number"||Math.floor(b)!==b)throw H.c(H.r(a,b))
if(b>=a.length||b<0)throw H.c(H.r(a,b))
return a[b]},
n:function(a,b,c){this.bI(a,"indexed set")
if(typeof b!=="number"||Math.floor(b)!==b)throw H.c(H.r(a,b))
if(b>=a.length||b<0)throw H.c(H.r(a,b))
a[b]=c},
$isD:1,
$asD:I.t,
$isi:1,
$asi:null,
$ish:1,
$ash:null},
iJ:{"^":"az;$ti"},
dS:{"^":"b;a,b,c,d",
gt:function(){return this.d},
q:function(){var z,y,x
z=this.a
y=z.length
if(this.b!==y)throw H.c(H.aQ(z))
x=this.c
if(x>=y){this.d=null
return!1}this.d=z[x]
this.c=x+1
return!0}},
aA:{"^":"d;",
ap:function(a){var z
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){z=a<0?Math.ceil(a):Math.floor(a)
return z+0}throw H.c(new P.q(""+a+".toInt()"))},
aV:function(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw H.c(new P.q(""+a+".round()"))},
aY:function(a){return a},
i:function(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gp:function(a){return a&0x1FFFFFFF},
K:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return a+b},
W:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return a-b},
U:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return a*b},
cd:function(a,b){var z
if(typeof b!=="number")throw H.c(H.w(b))
z=a%b
if(z===0)return 0
if(z>0)return z
if(b<0)return z-b
else return z+b},
at:function(a,b){if((a|0)===a)if(b>=1||!1)return a/b|0
return this.bz(a,b)},
Z:function(a,b){return(a|0)===a?a/b|0:this.bz(a,b)},
bz:function(a,b){var z=a/b
if(z>=-2147483648&&z<=2147483647)return z|0
if(z>0){if(z!==1/0)return Math.floor(z)}else if(z>-1/0)return Math.ceil(z)
throw H.c(new P.q("Result of truncating division is "+H.a(z)+": "+H.a(a)+" ~/ "+b))},
cq:function(a,b){if(b<0)throw H.c(H.w(b))
return b>31?0:a<<b>>>0},
cr:function(a,b){var z
if(b<0)throw H.c(H.w(b))
if(a>0)z=b>31?0:a>>>b
else{z=b>31?31:b
z=a>>z>>>0}return z},
N:function(a,b){var z
if(a>0)z=b>31?0:a>>>b
else{z=b>31?31:b
z=a>>z>>>0}return z},
cC:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return(a^b)>>>0},
a2:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return a<b},
ar:function(a,b){if(typeof b!=="number")throw H.c(H.w(b))
return a>b},
$isaP:1},
cc:{"^":"aA;",$isaP:1,$isk:1},
ex:{"^":"aA;",$isaP:1},
aB:{"^":"d;",
bJ:function(a,b){if(b>=a.length)throw H.c(H.r(a,b))
return a.charCodeAt(b)},
K:function(a,b){if(typeof b!=="string")throw H.c(P.bZ(b,null,null))
return a+b},
a3:function(a,b,c){var z
if(typeof b!=="number"||Math.floor(b)!==b)H.p(H.w(b))
if(c==null)c=a.length
if(typeof c!=="number"||Math.floor(c)!==c)H.p(H.w(c))
z=J.I(b)
if(z.a2(b,0))throw H.c(P.b3(b,null,null))
if(z.ar(b,c))throw H.c(P.b3(b,null,null))
if(J.du(c,a.length))throw H.c(P.b3(c,null,null))
return a.substring(b,c)},
cs:function(a,b){return this.a3(a,b,null)},
i:function(a){return a},
gp:function(a){var z,y,x
for(z=a.length,y=0,x=0;x<z;++x){y=536870911&y+a.charCodeAt(x)
y=536870911&y+((524287&y)<<10)
y^=y>>6}y=536870911&y+((67108863&y)<<3)
y^=y>>11
return 536870911&y+((16383&y)<<15)},
gk:function(a){return a.length},
h:function(a,b){if(typeof b!=="number"||Math.floor(b)!==b)throw H.c(H.r(a,b))
if(b>=a.length||b<0)throw H.c(H.r(a,b))
return a[b]},
$isD:1,
$asD:I.t,
$isH:1}}],["","",,H,{"^":"",
cb:function(){return new P.b6("No element")},
eu:function(){return new P.b6("Too few elements")},
h:{"^":"K;$ti",$ash:null},
aE:{"^":"h;$ti",
gA:function(a){return new H.cd(this,this.gk(this),0,null)},
a1:function(a,b){return new H.b0(this,b,[H.x(this,"aE",0),null])},
b_:function(a,b){var z,y,x
z=H.G([],[H.x(this,"aE",0)])
C.c.sk(z,this.gk(this))
for(y=0;y<this.gk(this);++y){x=this.J(0,y)
if(y>=z.length)return H.e(z,y)
z[y]=x}return z},
aZ:function(a){return this.b_(a,!0)}},
cd:{"^":"b;a,b,c,d",
gt:function(){return this.d},
q:function(){var z,y,x,w
z=this.a
y=J.F(z)
x=y.gk(z)
if(this.b!==x)throw H.c(new P.ah(z))
w=this.c
if(w>=x){this.d=null
return!1}this.d=y.J(z,w);++this.c
return!0}},
ce:{"^":"K;a,b,$ti",
gA:function(a){return new H.eP(null,J.aR(this.a),this.b,this.$ti)},
gk:function(a){return J.at(this.a)},
$asK:function(a,b){return[b]},
l:{
b_:function(a,b,c,d){if(!!J.j(a).$ish)return new H.c4(a,b,[c,d])
return new H.ce(a,b,[c,d])}}},
c4:{"^":"ce;a,b,$ti",$ish:1,
$ash:function(a,b){return[b]}},
eP:{"^":"ev;a,b,c,$ti",
q:function(){var z=this.b
if(z.q()){this.a=this.c.$1(z.gt())
return!0}this.a=null
return!1},
gt:function(){return this.a}},
b0:{"^":"aE;a,b,$ti",
gk:function(a){return J.at(this.a)},
J:function(a,b){return this.b.$1(J.dE(this.a,b))},
$asaE:function(a,b){return[b]},
$ash:function(a,b){return[b]},
$asK:function(a,b){return[b]}},
c8:{"^":"b;$ti",
sk:function(a,b){throw H.c(new P.q("Cannot change the length of a fixed-length list"))},
v:function(a,b){throw H.c(new P.q("Cannot add to a fixed-length list"))}},
bx:{"^":"b;d_:a<",
m:function(a,b){if(b==null)return!1
return b instanceof H.bx&&J.R(this.a,b.a)},
gp:function(a){var z,y
z=this._hashCode
if(z!=null)return z
y=J.N(this.a)
if(typeof y!=="number")return H.n(y)
z=536870911&664597*y
this._hashCode=z
return z},
i:function(a){return'Symbol("'+H.a(this.a)+'")'}}}],["","",,H,{"^":"",
aN:function(a,b){var z=a.a9(b)
if(!init.globalState.d.cy)init.globalState.f.ag()
return z},
dr:function(a,b){var z,y,x,w,v,u
z={}
z.a=b
if(b==null){b=[]
z.a=b
y=b}else y=b
if(!J.j(y).$isi)throw H.c(P.au("Arguments to main must be a List: "+H.a(y)))
init.globalState=new H.h6(0,0,1,null,null,null,null,null,null,null,null,null,a)
y=init.globalState
x=self.window==null
w=self.Worker
v=x&&!!self.postMessage
y.x=v
v=!v
if(v)w=w!=null&&$.$get$c9()!=null
else w=!0
y.y=w
y.r=x&&v
y.f=new H.fC(P.bt(null,H.aM),0)
x=P.k
y.z=new H.U(0,null,null,null,null,null,0,[x,H.bD])
y.ch=new H.U(0,null,null,null,null,null,0,[x,null])
if(y.x===!0){w=new H.h5()
y.Q=w
self.onmessage=function(c,d){return function(e){c(d,e)}}(H.en,w)
self.dartPrint=self.dartPrint||function(c){return function(d){if(self.console&&self.console.log)self.console.log(d)
else self.postMessage(c(d))}}(H.h7)}if(init.globalState.x===!0)return
y=init.globalState.a++
w=new H.U(0,null,null,null,null,null,0,[x,H.b4])
x=P.ai(null,null,null,x)
v=new H.b4(0,null,!1)
u=new H.bD(y,w,x,init.createNewIsolate(),v,new H.a5(H.bi()),new H.a5(H.bi()),!1,!1,[],P.ai(null,null,null,null),null,null,!1,!0,P.ai(null,null,null,null))
x.v(0,0)
u.b5(0,v)
init.globalState.e=u
init.globalState.d=u
y=H.ap()
if(H.a1(y,[y]).H(a))u.a9(new H.i7(z,a))
else if(H.a1(y,[y,y]).H(a))u.a9(new H.i8(z,a))
else u.a9(a)
init.globalState.f.ag()},
er:function(){var z=init.currentScript
if(z!=null)return String(z.src)
if(init.globalState.x===!0)return H.es()
return},
es:function(){var z,y
z=new Error().stack
if(z==null){z=function(){try{throw new Error()}catch(x){return x.stack}}()
if(z==null)throw H.c(new P.q("No stack trace"))}y=z.match(new RegExp("^ *at [^(]*\\((.*):[0-9]*:[0-9]*\\)$","m"))
if(y!=null)return y[1]
y=z.match(new RegExp("^[^@]*@(.*):[0-9]*$","m"))
if(y!=null)return y[1]
throw H.c(new P.q('Cannot extract URI from "'+H.a(z)+'"'))},
en:[function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o,n
z=new H.b9(!0,[]).P(b.data)
y=J.F(z)
switch(y.h(z,"command")){case"start":init.globalState.b=y.h(z,"id")
x=y.h(z,"functionName")
w=x==null?init.globalState.cx:init.globalFunctions[x]()
v=y.h(z,"args")
u=new H.b9(!0,[]).P(y.h(z,"msg"))
t=y.h(z,"isSpawnUri")
s=y.h(z,"startPaused")
r=new H.b9(!0,[]).P(y.h(z,"replyTo"))
y=init.globalState.a++
q=P.k
p=new H.U(0,null,null,null,null,null,0,[q,H.b4])
q=P.ai(null,null,null,q)
o=new H.b4(0,null,!1)
n=new H.bD(y,p,q,init.createNewIsolate(),o,new H.a5(H.bi()),new H.a5(H.bi()),!1,!1,[],P.ai(null,null,null,null),null,null,!1,!0,P.ai(null,null,null,null))
q.v(0,0)
n.b5(0,o)
init.globalState.f.a.F(new H.aM(n,new H.eo(w,v,u,t,s,r),"worker-start"))
init.globalState.d=n
init.globalState.f.ag()
break
case"spawn-worker":break
case"message":if(y.h(z,"port")!=null)y.h(z,"port").L(y.h(z,"msg"))
init.globalState.f.ag()
break
case"close":init.globalState.ch.af(0,$.$get$ca().h(0,a))
a.terminate()
init.globalState.f.ag()
break
case"log":H.em(y.h(z,"msg"))
break
case"print":if(init.globalState.x===!0){y=init.globalState.Q
q=P.V(["command","print","msg",z])
q=new H.aa(!0,P.aj(null,P.k)).B(q)
y.toString
self.postMessage(q)}else P.aq(y.h(z,"msg"))
break
case"error":throw H.c(y.h(z,"msg"))}},null,null,4,0,null,10,5],
em:function(a){var z,y,x,w
if(init.globalState.x===!0){y=init.globalState.Q
x=P.V(["command","log","msg",a])
x=new H.aa(!0,P.aj(null,P.k)).B(x)
y.toString
self.postMessage(x)}else try{self.console.log(a)}catch(w){H.z(w)
z=H.B(w)
throw H.c(P.aW(z))}},
ep:function(a,b,c,d,e,f){var z,y,x,w
z=init.globalState.d
y=z.a
$.cq=$.cq+("_"+y)
$.cr=$.cr+("_"+y)
y=z.e
x=init.globalState.d.a
w=z.f
f.L(["spawned",new H.bc(y,x),w,z.r])
x=new H.eq(a,b,c,d,z)
if(e===!0){z.bE(w,w)
init.globalState.f.a.F(new H.aM(z,x,"start isolate"))}else x.$0()},
hl:function(a){return new H.b9(!0,[]).P(new H.aa(!1,P.aj(null,P.k)).B(a))},
i7:{"^":"f:0;a,b",
$0:function(){this.b.$1(this.a.a)}},
i8:{"^":"f:0;a,b",
$0:function(){this.b.$2(this.a.a,null)}},
h6:{"^":"b;a,b,c,d,e,f,r,x,y,z,Q,ch,cx",l:{
h7:[function(a){var z=P.V(["command","print","msg",a])
return new H.aa(!0,P.aj(null,P.k)).B(z)},null,null,2,0,null,4]}},
bD:{"^":"b;a,b,c,dN:d<,df:e<,f,r,dJ:x?,aP:y<,di:z<,Q,ch,cx,cy,db,dx",
bE:function(a,b){if(!this.f.m(0,a))return
if(this.Q.v(0,b)&&!this.y)this.y=!0
this.aL()},
dW:function(a){var z,y,x,w,v,u
if(!this.y)return
z=this.Q
z.af(0,a)
if(z.a===0){for(z=this.z;y=z.length,y!==0;){if(0>=y)return H.e(z,-1)
x=z.pop()
y=init.globalState.f.a
w=y.b
v=y.a
u=v.length
w=(w-1&u-1)>>>0
y.b=w
if(w<0||w>=u)return H.e(v,w)
v[w]=x
if(w===y.c)y.bh();++y.d}this.y=!1}this.aL()},
d9:function(a,b){var z,y,x
if(this.ch==null)this.ch=[]
for(z=J.j(a),y=0;x=this.ch,y<x.length;y+=2)if(z.m(a,x[y])){z=this.ch
x=y+1
if(x>=z.length)return H.e(z,x)
z[x]=b
return}x.push(a)
this.ch.push(b)},
dV:function(a){var z,y,x
if(this.ch==null)return
for(z=J.j(a),y=0;x=this.ch,y<x.length;y+=2)if(z.m(a,x[y])){z=this.ch
x=y+2
z.toString
if(typeof z!=="object"||z===null||!!z.fixed$length)H.p(new P.q("removeRange"))
P.cw(y,x,z.length,null,null,null)
z.splice(y,x-y)
return}},
cp:function(a,b){if(!this.r.m(0,a))return
this.db=b},
dD:function(a,b,c){var z=J.j(b)
if(!z.m(b,0))z=z.m(b,1)&&!this.cy
else z=!0
if(z){a.L(c)
return}z=this.cx
if(z==null){z=P.bt(null,null)
this.cx=z}z.F(new H.fX(a,c))},
dC:function(a,b){var z
if(!this.r.m(0,a))return
z=J.j(b)
if(!z.m(b,0))z=z.m(b,1)&&!this.cy
else z=!0
if(z){this.aQ()
return}z=this.cx
if(z==null){z=P.bt(null,null)
this.cx=z}z.F(this.gdP())},
dE:function(a,b){var z,y,x
z=this.dx
if(z.a===0){if(this.db===!0&&this===init.globalState.e)return
if(self.console&&self.console.error)self.console.error(a,b)
else{P.aq(a)
if(b!=null)P.aq(b)}return}y=new Array(2)
y.fixed$length=Array
y[0]=J.a3(a)
y[1]=b==null?null:J.a3(b)
for(x=new P.cZ(z,z.r,null,null),x.c=z.e;x.q();)x.d.L(y)},
a9:function(a){var z,y,x,w,v,u,t
z=init.globalState.d
init.globalState.d=this
$=this.d
y=null
x=this.cy
this.cy=!0
try{y=a.$0()}catch(u){t=H.z(u)
w=t
v=H.B(u)
this.dE(w,v)
if(this.db===!0){this.aQ()
if(this===init.globalState.e)throw u}}finally{this.cy=x
init.globalState.d=z
if(z!=null)$=z.gdN()
if(this.cx!=null)for(;t=this.cx,!t.gw(t);)this.cx.bY().$0()}return y},
dA:function(a){var z=J.F(a)
switch(z.h(a,0)){case"pause":this.bE(z.h(a,1),z.h(a,2))
break
case"resume":this.dW(z.h(a,1))
break
case"add-ondone":this.d9(z.h(a,1),z.h(a,2))
break
case"remove-ondone":this.dV(z.h(a,1))
break
case"set-errors-fatal":this.cp(z.h(a,1),z.h(a,2))
break
case"ping":this.dD(z.h(a,1),z.h(a,2),z.h(a,3))
break
case"kill":this.dC(z.h(a,1),z.h(a,2))
break
case"getErrors":this.dx.v(0,z.h(a,1))
break
case"stopErrors":this.dx.af(0,z.h(a,1))
break}},
bQ:function(a){return this.b.h(0,a)},
b5:function(a,b){var z=this.b
if(z.am(a))throw H.c(P.aW("Registry: ports must be registered only once."))
z.n(0,a,b)},
aL:function(){var z=this.b
if(z.gk(z)-this.c.a>0||this.y||!this.x)init.globalState.z.n(0,this.a,this)
else this.aQ()},
aQ:[function(){var z,y,x,w,v
z=this.cx
if(z!=null)z.a0(0)
for(z=this.b,y=z.gc4(z),y=y.gA(y);y.q();)y.gt().cR()
z.a0(0)
this.c.a0(0)
init.globalState.z.af(0,this.a)
this.dx.a0(0)
if(this.ch!=null){for(x=0;z=this.ch,y=z.length,x<y;x+=2){w=z[x]
v=x+1
if(v>=y)return H.e(z,v)
w.L(z[v])}this.ch=null}},"$0","gdP",0,0,2]},
fX:{"^":"f:2;a,b",
$0:[function(){this.a.L(this.b)},null,null,0,0,null,"call"]},
fC:{"^":"b;a,b",
dj:function(){var z=this.a
if(z.b===z.c)return
return z.bY()},
c1:function(){var z,y,x
z=this.dj()
if(z==null){if(init.globalState.e!=null)if(init.globalState.z.am(init.globalState.e.a))if(init.globalState.r===!0){y=init.globalState.e.b
y=y.gw(y)}else y=!1
else y=!1
else y=!1
if(y)H.p(P.aW("Program exited with open ReceivePorts."))
y=init.globalState
if(y.x===!0){x=y.z
x=x.gw(x)&&y.f.b===0}else x=!1
if(x){y=y.Q
x=P.V(["command","close"])
x=new H.aa(!0,new P.d_(0,null,null,null,null,null,0,[null,P.k])).B(x)
y.toString
self.postMessage(x)}return!1}z.dU()
return!0},
bv:function(){if(self.window!=null)new H.fD(this).$0()
else for(;this.c1(););},
ag:function(){var z,y,x,w,v
if(init.globalState.x!==!0)this.bv()
else try{this.bv()}catch(x){w=H.z(x)
z=w
y=H.B(x)
w=init.globalState.Q
v=P.V(["command","error","msg",H.a(z)+"\n"+H.a(y)])
v=new H.aa(!0,P.aj(null,P.k)).B(v)
w.toString
self.postMessage(v)}}},
fD:{"^":"f:2;a",
$0:function(){if(!this.a.c1())return
P.fj(C.f,this)}},
aM:{"^":"b;a,b,c",
dU:function(){var z=this.a
if(z.gaP()){z.gdi().push(this)
return}z.a9(this.b)}},
h5:{"^":"b;"},
eo:{"^":"f:0;a,b,c,d,e,f",
$0:function(){H.ep(this.a,this.b,this.c,this.d,this.e,this.f)}},
eq:{"^":"f:2;a,b,c,d,e",
$0:function(){var z,y,x
z=this.e
z.sdJ(!0)
if(this.d!==!0)this.a.$1(this.c)
else{y=this.a
x=H.ap()
if(H.a1(x,[x,x]).H(y))y.$2(this.b,this.c)
else if(H.a1(x,[x]).H(y))y.$1(this.b)
else y.$0()}z.aL()}},
cU:{"^":"b;"},
bc:{"^":"cU;b,a",
L:function(a){var z,y,x
z=init.globalState.z.h(0,this.a)
if(z==null)return
y=this.b
if(y.gbl())return
x=H.hl(a)
if(z.gdf()===y){z.dA(x)
return}init.globalState.f.a.F(new H.aM(z,new H.h9(this,x),"receive"))},
m:function(a,b){if(b==null)return!1
return b instanceof H.bc&&J.R(this.b,b.b)},
gp:function(a){return this.b.gaG()}},
h9:{"^":"f:0;a,b",
$0:function(){var z=this.a.b
if(!z.gbl())z.cL(this.b)}},
bE:{"^":"cU;b,c,a",
L:function(a){var z,y,x
z=P.V(["command","message","port",this,"msg",a])
y=new H.aa(!0,P.aj(null,P.k)).B(z)
if(init.globalState.x===!0){init.globalState.Q.toString
self.postMessage(y)}else{x=init.globalState.ch.h(0,this.b)
if(x!=null)x.postMessage(y)}},
m:function(a,b){if(b==null)return!1
return b instanceof H.bE&&J.R(this.b,b.b)&&J.R(this.a,b.a)&&J.R(this.c,b.c)},
gp:function(a){var z,y,x
z=J.bT(this.b,16)
y=J.bT(this.a,8)
x=this.c
if(typeof x!=="number")return H.n(x)
return(z^y^x)>>>0}},
b4:{"^":"b;aG:a<,b,bl:c<",
cR:function(){this.c=!0
this.b=null},
cL:function(a){if(this.c)return
this.b.$1(a)},
$iseZ:1},
cD:{"^":"b;a,b,c",
al:function(){if(self.setTimeout!=null){if(this.b)throw H.c(new P.q("Timer in event loop cannot be canceled."))
var z=this.c
if(z==null)return;--init.globalState.f.b
if(this.a)self.clearTimeout(z)
else self.clearInterval(z)
this.c=null}else throw H.c(new P.q("Canceling a timer."))},
cF:function(a,b){if(self.setTimeout!=null){++init.globalState.f.b
this.c=self.setInterval(H.ad(new H.fg(this,b),0),a)}else throw H.c(new P.q("Periodic timer."))},
cE:function(a,b){var z,y
if(a===0)z=self.setTimeout==null||init.globalState.x===!0
else z=!1
if(z){this.c=1
z=init.globalState.f
y=init.globalState.d
z.a.F(new H.aM(y,new H.fh(this,b),"timer"))
this.b=!0}else if(self.setTimeout!=null){++init.globalState.f.b
this.c=self.setTimeout(H.ad(new H.fi(this,b),0),a)}else throw H.c(new P.q("Timer greater than 0."))},
l:{
fe:function(a,b){var z=new H.cD(!0,!1,null)
z.cE(a,b)
return z},
ff:function(a,b){var z=new H.cD(!1,!1,null)
z.cF(a,b)
return z}}},
fh:{"^":"f:2;a,b",
$0:function(){this.a.c=null
this.b.$0()}},
fi:{"^":"f:2;a,b",
$0:[function(){this.a.c=null;--init.globalState.f.b
this.b.$0()},null,null,0,0,null,"call"]},
fg:{"^":"f:0;a,b",
$0:[function(){this.b.$1(this.a)},null,null,0,0,null,"call"]},
a5:{"^":"b;aG:a<",
gp:function(a){var z,y,x
z=this.a
y=J.I(z)
x=y.cr(z,0)
y=y.at(z,4294967296)
if(typeof y!=="number")return H.n(y)
z=x^y
z=(~z>>>0)+(z<<15>>>0)&4294967295
z=((z^z>>>12)>>>0)*5&4294967295
z=((z^z>>>4)>>>0)*2057&4294967295
return(z^z>>>16)>>>0},
m:function(a,b){var z,y
if(b==null)return!1
if(b===this)return!0
if(b instanceof H.a5){z=this.a
y=b.a
return z==null?y==null:z===y}return!1}},
aa:{"^":"b;a,b",
B:[function(a){var z,y,x,w,v
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
z=this.b
y=z.h(0,a)
if(y!=null)return["ref",y]
z.n(0,a,z.gk(z))
z=J.j(a)
if(!!z.$iscg)return["buffer",a]
if(!!z.$isb1)return["typed",a]
if(!!z.$isD)return this.cl(a)
if(!!z.$isel){x=this.gci()
w=a.gbO()
w=H.b_(w,x,H.x(w,"K",0),null)
w=P.a7(w,!0,H.x(w,"K",0))
z=z.gc4(a)
z=H.b_(z,x,H.x(z,"K",0),null)
return["map",w,P.a7(z,!0,H.x(z,"K",0))]}if(!!z.$iseA)return this.cm(a)
if(!!z.$isd)this.c3(a)
if(!!z.$iseZ)this.ah(a,"RawReceivePorts can't be transmitted:")
if(!!z.$isbc)return this.cn(a)
if(!!z.$isbE)return this.co(a)
if(!!z.$isf){v=a.$static_name
if(v==null)this.ah(a,"Closures can't be transmitted:")
return["function",v]}if(!!z.$isa5)return["capability",a.a]
if(!(a instanceof P.b))this.c3(a)
return["dart",init.classIdExtractor(a),this.ck(init.classFieldsExtractor(a))]},"$1","gci",2,0,1,6],
ah:function(a,b){throw H.c(new P.q(H.a(b==null?"Can't transmit:":b)+" "+H.a(a)))},
c3:function(a){return this.ah(a,null)},
cl:function(a){var z=this.cj(a)
if(!!a.fixed$length)return["fixed",z]
if(!a.fixed$length)return["extendable",z]
if(!a.immutable$list)return["mutable",z]
if(a.constructor===Array)return["const",z]
this.ah(a,"Can't serialize indexable: ")},
cj:function(a){var z,y,x
z=[]
C.c.sk(z,a.length)
for(y=0;y<a.length;++y){x=this.B(a[y])
if(y>=z.length)return H.e(z,y)
z[y]=x}return z},
ck:function(a){var z
for(z=0;z<a.length;++z)C.c.n(a,z,this.B(a[z]))
return a},
cm:function(a){var z,y,x,w
if(!!a.constructor&&a.constructor!==Object)this.ah(a,"Only plain JS Objects are supported:")
z=Object.keys(a)
y=[]
C.c.sk(y,z.length)
for(x=0;x<z.length;++x){w=this.B(a[z[x]])
if(x>=y.length)return H.e(y,x)
y[x]=w}return["js-object",z,y]},
co:function(a){if(this.a)return["sendport",a.b,a.a,a.c]
return["raw sendport",a]},
cn:function(a){if(this.a)return["sendport",init.globalState.b,a.a,a.b.gaG()]
return["raw sendport",a]}},
b9:{"^":"b;a,b",
P:[function(a){var z,y,x,w,v,u
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
if(typeof a!=="object"||a===null||a.constructor!==Array)throw H.c(P.au("Bad serialized message: "+H.a(a)))
switch(C.c.gdz(a)){case"ref":if(1>=a.length)return H.e(a,1)
z=a[1]
y=this.b
if(z>>>0!==z||z>=y.length)return H.e(y,z)
return y[z]
case"buffer":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
return x
case"typed":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
return x
case"fixed":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
y=H.G(this.a8(x),[null])
y.fixed$length=Array
return y
case"extendable":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
return H.G(this.a8(x),[null])
case"mutable":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
return this.a8(x)
case"const":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
y=H.G(this.a8(x),[null])
y.fixed$length=Array
return y
case"map":return this.dm(a)
case"sendport":return this.dn(a)
case"raw sendport":if(1>=a.length)return H.e(a,1)
x=a[1]
this.b.push(x)
return x
case"js-object":return this.dl(a)
case"function":if(1>=a.length)return H.e(a,1)
x=init.globalFunctions[a[1]]()
this.b.push(x)
return x
case"capability":if(1>=a.length)return H.e(a,1)
return new H.a5(a[1])
case"dart":y=a.length
if(1>=y)return H.e(a,1)
w=a[1]
if(2>=y)return H.e(a,2)
v=a[2]
u=init.instanceFromClassId(w)
this.b.push(u)
this.a8(v)
return init.initializeEmptyInstance(w,u,v)
default:throw H.c("couldn't deserialize: "+H.a(a))}},"$1","gdk",2,0,1,6],
a8:function(a){var z,y,x
z=J.F(a)
y=0
while(!0){x=z.gk(a)
if(typeof x!=="number")return H.n(x)
if(!(y<x))break
z.n(a,y,this.P(z.h(a,y)));++y}return a},
dm:function(a){var z,y,x,w,v,u
z=a.length
if(1>=z)return H.e(a,1)
y=a[1]
if(2>=z)return H.e(a,2)
x=a[2]
w=P.eM()
this.b.push(w)
y=J.bX(y,this.gdk()).aZ(0)
for(z=J.F(y),v=J.F(x),u=0;u<z.gk(y);++u)w.n(0,z.h(y,u),this.P(v.h(x,u)))
return w},
dn:function(a){var z,y,x,w,v,u,t
z=a.length
if(1>=z)return H.e(a,1)
y=a[1]
if(2>=z)return H.e(a,2)
x=a[2]
if(3>=z)return H.e(a,3)
w=a[3]
if(J.R(y,init.globalState.b)){v=init.globalState.z.h(0,x)
if(v==null)return
u=v.bQ(w)
if(u==null)return
t=new H.bc(u,x)}else t=new H.bE(y,w,x)
this.b.push(t)
return t},
dl:function(a){var z,y,x,w,v,u,t
z=a.length
if(1>=z)return H.e(a,1)
y=a[1]
if(2>=z)return H.e(a,2)
x=a[2]
w={}
this.b.push(w)
z=J.F(y)
v=J.F(x)
u=0
while(!0){t=z.gk(y)
if(typeof t!=="number")return H.n(t)
if(!(u<t))break
w[z.h(y,u)]=this.P(v.h(x,u));++u}return w}}}],["","",,H,{"^":"",
e0:function(){throw H.c(new P.q("Cannot modify unmodifiable Map"))},
dl:function(a){return init.getTypeFromName(a)},
hO:function(a){return init.types[a]},
dj:function(a,b){var z
if(b!=null){z=b.x
if(z!=null)return z}return!!J.j(a).$isL},
a:function(a){var z
if(typeof a==="string")return a
if(typeof a==="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
z=J.a3(a)
if(typeof z!=="string")throw H.c(H.w(a))
return z},
Y:function(a){var z=a.$identityHash
if(z==null){z=Math.random()*0x3fffffff|0
a.$identityHash=z}return z},
co:function(a,b){throw H.c(new P.ee(a,null,null))},
ct:function(a,b,c){var z,y
H.hI(a)
z=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(z==null)return H.co(a,c)
if(3>=z.length)return H.e(z,3)
y=z[3]
if(y!=null)return parseInt(a,10)
if(z[2]!=null)return parseInt(a,16)
return H.co(a,c)},
cs:function(a){var z,y,x,w,v,u,t,s
z=J.j(a)
y=z.constructor
if(typeof y=="function"){x=y.name
w=typeof x==="string"?x:null}else w=null
if(w==null||z===C.q||!!J.j(a).$isaK){v=C.j(a)
if(v==="Object"){u=a.constructor
if(typeof u=="function"){t=String(u).match(/^\s*function\s*([\w$]*)\s*\(/)
s=t==null?null:t[1]
if(typeof s==="string"&&/^\w+$/.test(s))w=s}if(w==null)w=v}else w=v}w=w
if(w.length>1&&C.h.bJ(w,0)===36)w=C.h.cs(w,1)
return function(b,c){return b.replace(/[^<,> ]+/g,function(d){return c[d]||d})}(w+H.dk(H.bP(a),0,null),init.mangledGlobalNames)},
b2:function(a){return"Instance of '"+H.cs(a)+"'"},
A:function(a){var z
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){z=a-65536
return String.fromCharCode((55296|C.a.N(z,10))>>>0,56320|z&1023)}throw H.c(P.Z(a,0,1114111,null,null))},
y:function(a){if(a.date===void 0)a.date=new Date(a.a)
return a.date},
bw:function(a,b){if(a==null||typeof a==="boolean"||typeof a==="number"||typeof a==="string")throw H.c(H.w(a))
return a[b]},
cu:function(a,b,c){if(a==null||typeof a==="boolean"||typeof a==="number"||typeof a==="string")throw H.c(H.w(a))
a[b]=c},
cp:function(a,b,c){var z,y,x
z={}
z.a=0
y=[]
x=[]
z.a=b.length
C.c.bD(y,b)
z.b=""
if(c!=null&&!c.gw(c))c.S(0,new H.eY(z,y,x))
return J.dL(a,new H.ey(C.C,""+"$"+z.a+z.b,0,y,x,null))},
eX:function(a,b){var z,y
z=b instanceof Array?b:P.a7(b,!0,null)
y=z.length
if(y===0){if(!!a.$0)return a.$0()}else if(y===1){if(!!a.$1)return a.$1(z[0])}else if(y===2){if(!!a.$2)return a.$2(z[0],z[1])}else if(y===3){if(!!a.$3)return a.$3(z[0],z[1],z[2])}else if(y===4){if(!!a.$4)return a.$4(z[0],z[1],z[2],z[3])}else if(y===5)if(!!a.$5)return a.$5(z[0],z[1],z[2],z[3],z[4])
return H.eW(a,z)},
eW:function(a,b){var z,y,x,w,v,u
z=b.length
y=a[""+"$"+z]
if(y==null){y=J.j(a)["call*"]
if(y==null)return H.cp(a,b,null)
x=H.cx(y)
w=x.d
v=w+x.e
if(x.f||w>z||v<z)return H.cp(a,b,null)
b=P.a7(b,!0,null)
for(u=z;u<v;++u)C.c.v(b,init.metadata[x.dh(0,u)])}return y.apply(a,b)},
n:function(a){throw H.c(H.w(a))},
e:function(a,b){if(a==null)J.at(a)
throw H.c(H.r(a,b))},
r:function(a,b){var z,y
if(typeof b!=="number"||Math.floor(b)!==b)return new P.a4(!0,b,"index",null)
z=J.at(a)
if(!(b<0)){if(typeof z!=="number")return H.n(z)
y=b>=z}else y=!0
if(y)return P.aY(b,a,"index",null,z)
return P.b3(b,"index",null)},
w:function(a){return new P.a4(!0,a,null,null)},
hI:function(a){if(typeof a!=="string")throw H.c(H.w(a))
return a},
c:function(a){var z
if(a==null)a=new P.cn()
z=new Error()
z.dartException=a
if("defineProperty" in Object){Object.defineProperty(z,"message",{get:H.dt})
z.name=""}else z.toString=H.dt
return z},
dt:[function(){return J.a3(this.dartException)},null,null,0,0,null],
p:function(a){throw H.c(a)},
aQ:function(a){throw H.c(new P.ah(a))},
z:function(a){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l
z=new H.ia(a)
if(a==null)return
if(typeof a!=="object")return a
if("dartException" in a)return z.$1(a.dartException)
else if(!("message" in a))return a
y=a.message
if("number" in a&&typeof a.number=="number"){x=a.number
w=x&65535
if((C.a.N(x,16)&8191)===10)switch(w){case 438:return z.$1(H.bq(H.a(y)+" (Error "+w+")",null))
case 445:case 5007:v=H.a(y)+" (Error "+w+")"
return z.$1(new H.cm(v,null))}}if(a instanceof TypeError){u=$.$get$cG()
t=$.$get$cH()
s=$.$get$cI()
r=$.$get$cJ()
q=$.$get$cN()
p=$.$get$cO()
o=$.$get$cL()
$.$get$cK()
n=$.$get$cQ()
m=$.$get$cP()
l=u.D(y)
if(l!=null)return z.$1(H.bq(y,l))
else{l=t.D(y)
if(l!=null){l.method="call"
return z.$1(H.bq(y,l))}else{l=s.D(y)
if(l==null){l=r.D(y)
if(l==null){l=q.D(y)
if(l==null){l=p.D(y)
if(l==null){l=o.D(y)
if(l==null){l=r.D(y)
if(l==null){l=n.D(y)
if(l==null){l=m.D(y)
v=l!=null}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0}else v=!0
if(v)return z.$1(new H.cm(y,l==null?null:l.method))}}return z.$1(new H.fm(typeof y==="string"?y:""))}if(a instanceof RangeError){if(typeof y==="string"&&y.indexOf("call stack")!==-1)return new P.cz()
y=function(b){try{return String(b)}catch(k){}return null}(a)
return z.$1(new P.a4(!1,null,null,typeof y==="string"?y.replace(/^RangeError:\s*/,""):y))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof y==="string"&&y==="too much recursion")return new P.cz()
return a},
B:function(a){var z
if(a==null)return new H.d0(a,null)
z=a.$cachedTrace
if(z!=null)return z
return a.$cachedTrace=new H.d0(a,null)},
i5:function(a){if(a==null||typeof a!='object')return J.N(a)
else return H.Y(a)},
hM:function(a,b){var z,y,x,w
z=a.length
for(y=0;y<z;y=w){x=y+1
w=x+1
b.n(0,a[y],a[x])}return b},
hV:[function(a,b,c,d,e,f,g){switch(c){case 0:return H.aN(b,new H.hW(a))
case 1:return H.aN(b,new H.hX(a,d))
case 2:return H.aN(b,new H.hY(a,d,e))
case 3:return H.aN(b,new H.hZ(a,d,e,f))
case 4:return H.aN(b,new H.i_(a,d,e,f,g))}throw H.c(P.aW("Unsupported number of arguments for wrapped closure"))},null,null,14,0,null,11,12,13,14,15,16,17],
ad:function(a,b){var z
if(a==null)return
z=a.$identity
if(!!z)return z
z=function(c,d,e,f){return function(g,h,i,j){return f(c,e,d,g,h,i,j)}}(a,b,init.globalState.d,H.hV)
a.$identity=z
return z},
dX:function(a,b,c,d,e,f){var z,y,x,w,v,u,t,s,r,q,p,o,n,m
z=b[0]
y=z.$callName
if(!!J.j(c).$isi){z.$reflectionInfo=c
x=H.cx(z).r}else x=c
w=d?Object.create(new H.f7().constructor.prototype):Object.create(new H.bl(null,null,null,null).constructor.prototype)
w.$initialize=w.constructor
if(d)v=function(){this.$initialize()}
else{u=$.J
$.J=J.Q(u,1)
u=new Function("a,b,c,d"+u,"this.$initialize(a,b,c,d"+u+")")
v=u}w.constructor=v
v.prototype=w
if(!d){t=e.length==1&&!0
s=H.c2(a,z,t)
s.$reflectionInfo=c}else{w.$static_name=f
s=z
t=!1}if(typeof x=="number")r=function(g,h){return function(){return g(h)}}(H.hO,x)
else if(typeof x=="function")if(d)r=x
else{q=t?H.c0:H.bm
r=function(g,h){return function(){return g.apply({$receiver:h(this)},arguments)}}(x,q)}else throw H.c("Error in reflectionInfo.")
w.$signature=r
w[y]=s
for(u=b.length,p=1;p<u;++p){o=b[p]
n=o.$callName
if(n!=null){m=d?o:H.c2(a,o,t)
w[n]=m}}w["call*"]=s
w.$requiredArgCount=z.$requiredArgCount
w.$defaultValues=z.$defaultValues
return v},
dU:function(a,b,c,d){var z=H.bm
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,z)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,z)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,z)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,z)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,z)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,z)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,z)}},
c2:function(a,b,c){var z,y,x,w,v,u,t
if(c)return H.dW(a,b)
z=b.$stubName
y=b.length
x=a[z]
w=b==null?x==null:b===x
v=!w||y>=27
if(v)return H.dU(y,!w,z,b)
if(y===0){w=$.J
$.J=J.Q(w,1)
u="self"+H.a(w)
w="return function(){var "+u+" = this."
v=$.ag
if(v==null){v=H.aT("self")
$.ag=v}return new Function(w+H.a(v)+";return "+u+"."+H.a(z)+"();}")()}t="abcdefghijklmnopqrstuvwxyz".split("").splice(0,y).join(",")
w=$.J
$.J=J.Q(w,1)
t+=H.a(w)
w="return function("+t+"){return this."
v=$.ag
if(v==null){v=H.aT("self")
$.ag=v}return new Function(w+H.a(v)+"."+H.a(z)+"("+t+");}")()},
dV:function(a,b,c,d){var z,y
z=H.bm
y=H.c0
switch(b?-1:a){case 0:throw H.c(new H.f0("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,z,y)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,z,y)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,z,y)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,z,y)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,z,y)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,z,y)
default:return function(e,f,g,h){return function(){h=[g(this)]
Array.prototype.push.apply(h,arguments)
return e.apply(f(this),h)}}(d,z,y)}},
dW:function(a,b){var z,y,x,w,v,u,t,s
z=H.dT()
y=$.c_
if(y==null){y=H.aT("receiver")
$.c_=y}x=b.$stubName
w=b.length
v=a[x]
u=b==null?v==null:b===v
t=!u||w>=28
if(t)return H.dV(w,!u,x,b)
if(w===1){y="return function(){return this."+H.a(z)+"."+H.a(x)+"(this."+H.a(y)+");"
u=$.J
$.J=J.Q(u,1)
return new Function(y+H.a(u)+"}")()}s="abcdefghijklmnopqrstuvwxyz".split("").splice(0,w-1).join(",")
y="return function("+s+"){return this."+H.a(z)+"."+H.a(x)+"(this."+H.a(y)+", "+s+");"
u=$.J
$.J=J.Q(u,1)
return new Function(y+H.a(u)+"}")()},
bK:function(a,b,c,d,e,f){var z
b.fixed$length=Array
if(!!J.j(c).$isi){c.fixed$length=Array
z=c}else z=c
return H.dX(a,b,z,!!d,e,f)},
i9:function(a){throw H.c(new P.e4(a))},
hL:function(a){var z=J.j(a)
return"$signature" in z?z.$signature():null},
a1:function(a,b,c){return new H.f1(a,b,c,null)},
df:function(a,b){var z=a.builtin$cls
if(b==null||b.length===0)return new H.f3(z)
return new H.f2(z,b,null)},
ap:function(){return C.n},
bi:function(){return(Math.random()*0x100000000>>>0)+(Math.random()*0x100000000>>>0)*4294967296},
bO:function(a){return init.getIsolateTag(a)},
G:function(a,b){a.$ti=b
return a},
bP:function(a){if(a==null)return
return a.$ti},
dh:function(a,b){return H.ds(a["$as"+H.a(b)],H.bP(a))},
x:function(a,b,c){var z=H.dh(a,b)
return z==null?null:z[c]},
ae:function(a,b){var z=H.bP(a)
return z==null?null:z[b]},
af:function(a,b){var z
if(a==null)return"dynamic"
if(typeof a==="object"&&a!==null&&a.constructor===Array)return a[0].builtin$cls+H.dk(a,1,b)
if(typeof a=="function")return a.builtin$cls
if(typeof a==="number"&&Math.floor(a)===a)return H.a(a)
if(typeof a.func!="undefined"){z=a.typedef
if(z!=null)return H.af(z,b)
return H.ho(a,b)}return"unknown-reified-type"},
ho:function(a,b){var z,y,x,w,v,u,t,s,r,q,p
z=!!a.v?"void":H.af(a.ret,b)
if("args" in a){y=a.args
for(x=y.length,w="",v="",u=0;u<x;++u,v=", "){t=y[u]
w=w+v+H.af(t,b)}}else{w=""
v=""}if("opt" in a){s=a.opt
w+=v+"["
for(x=s.length,v="",u=0;u<x;++u,v=", "){t=s[u]
w=w+v+H.af(t,b)}w+="]"}if("named" in a){r=a.named
w+=v+"{"
for(x=H.bM(r),q=x.length,v="",u=0;u<q;++u,v=", "){p=x[u]
w=w+v+H.af(r[p],b)+(" "+H.a(p))}w+="}"}return"("+w+") => "+z},
dk:function(a,b,c){var z,y,x,w,v,u
if(a==null)return""
z=new P.aI("")
for(y=b,x=!0,w=!0,v="";y<a.length;++y){if(x)x=!1
else z.j=v+", "
u=a[y]
if(u!=null)w=!1
v=z.j+=H.af(u,c)}return w?"":"<"+z.i(0)+">"},
ds:function(a,b){if(a==null)return b
a=a.apply(null,b)
if(a==null)return
if(typeof a==="object"&&a!==null&&a.constructor===Array)return a
if(typeof a=="function")return a.apply(null,b)
return b},
hA:function(a,b){var z,y
if(a==null||b==null)return!0
z=a.length
for(y=0;y<z;++y)if(!H.C(a[y],b[y]))return!1
return!0},
dg:function(a,b,c){return a.apply(b,H.dh(b,c))},
C:function(a,b){var z,y,x,w,v,u
if(a===b)return!0
if(a==null||b==null)return!0
if(a.builtin$cls==="eU")return!0
if('func' in b)return H.di(a,b)
if('func' in a)return b.builtin$cls==="bn"||b.builtin$cls==="b"
z=typeof a==="object"&&a!==null&&a.constructor===Array
y=z?a[0]:a
x=typeof b==="object"&&b!==null&&b.constructor===Array
w=x?b[0]:b
if(w!==y){v=H.af(w,null)
if(!('$is'+v in y.prototype))return!1
u=y.prototype["$as"+v]}else u=null
if(!z&&u==null||!x)return!0
z=z?a.slice(1):null
x=b.slice(1)
return H.hA(H.ds(u,z),x)},
dd:function(a,b,c){var z,y,x,w,v
z=b==null
if(z&&a==null)return!0
if(z)return c
if(a==null)return!1
y=a.length
x=b.length
if(c){if(y<x)return!1}else if(y!==x)return!1
for(w=0;w<x;++w){z=a[w]
v=b[w]
if(!(H.C(z,v)||H.C(v,z)))return!1}return!0},
hz:function(a,b){var z,y,x,w,v,u
if(b==null)return!0
if(a==null)return!1
z=Object.getOwnPropertyNames(b)
z.fixed$length=Array
y=z
for(z=y.length,x=0;x<z;++x){w=y[x]
if(!Object.hasOwnProperty.call(a,w))return!1
v=b[w]
u=a[w]
if(!(H.C(v,u)||H.C(u,v)))return!1}return!0},
di:function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l
if(!('func' in a))return!1
if("v" in a){if(!("v" in b)&&"ret" in b)return!1}else if(!("v" in b)){z=a.ret
y=b.ret
if(!(H.C(z,y)||H.C(y,z)))return!1}x=a.args
w=b.args
v=a.opt
u=b.opt
t=x!=null?x.length:0
s=w!=null?w.length:0
r=v!=null?v.length:0
q=u!=null?u.length:0
if(t>s)return!1
if(t+r<s+q)return!1
if(t===s){if(!H.dd(x,w,!1))return!1
if(!H.dd(v,u,!0))return!1}else{for(p=0;p<t;++p){o=x[p]
n=w[p]
if(!(H.C(o,n)||H.C(n,o)))return!1}for(m=p,l=0;m<s;++l,++m){o=v[l]
n=w[m]
if(!(H.C(o,n)||H.C(n,o)))return!1}for(m=0;m<q;++l,++m){o=v[l]
n=u[m]
if(!(H.C(o,n)||H.C(n,o)))return!1}}return H.hz(a.named,b.named)},
jt:function(a){var z=$.bQ
return"Instance of "+(z==null?"<Unknown>":z.$1(a))},
jq:function(a){return H.Y(a)},
jp:function(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
i2:function(a){var z,y,x,w,v,u
z=$.bQ.$1(a)
y=$.bd[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.bf[z]
if(x!=null)return x
w=init.interceptorsByTag[z]
if(w==null){z=$.dc.$2(a,z)
if(z!=null){y=$.bd[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.bf[z]
if(x!=null)return x
w=init.interceptorsByTag[z]}}if(w==null)return
x=w.prototype
v=z[0]
if(v==="!"){y=H.bS(x)
$.bd[z]=y
Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}if(v==="~"){$.bf[z]=x
return x}if(v==="-"){u=H.bS(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}if(v==="+")return H.dn(a,x)
if(v==="*")throw H.c(new P.cR(z))
if(init.leafTags[z]===true){u=H.bS(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}else return H.dn(a,x)},
dn:function(a,b){var z=Object.getPrototypeOf(a)
Object.defineProperty(z,init.dispatchPropertyName,{value:J.bh(b,z,null,null),enumerable:false,writable:true,configurable:true})
return b},
bS:function(a){return J.bh(a,!1,null,!!a.$isL)},
i4:function(a,b,c){var z=b.prototype
if(init.leafTags[a]===true)return J.bh(z,!1,null,!!z.$isL)
else return J.bh(z,c,null,null)},
hT:function(){if(!0===$.bR)return
$.bR=!0
H.hU()},
hU:function(){var z,y,x,w,v,u,t,s
$.bd=Object.create(null)
$.bf=Object.create(null)
H.hP()
z=init.interceptorsByTag
y=Object.getOwnPropertyNames(z)
if(typeof window!="undefined"){window
x=function(){}
for(w=0;w<y.length;++w){v=y[w]
u=$.dp.$1(v)
if(u!=null){t=H.i4(v,z[v],u)
if(t!=null){Object.defineProperty(u,init.dispatchPropertyName,{value:t,enumerable:false,writable:true,configurable:true})
x.prototype=u}}}}for(w=0;w<y.length;++w){v=y[w]
if(/^[A-Za-z_]/.test(v)){s=z[v]
z["!"+v]=s
z["~"+v]=s
z["-"+v]=s
z["+"+v]=s
z["*"+v]=s}}},
hP:function(){var z,y,x,w,v,u,t
z=C.v()
z=H.ac(C.r,H.ac(C.x,H.ac(C.i,H.ac(C.i,H.ac(C.w,H.ac(C.t,H.ac(C.u(C.j),z)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){y=dartNativeDispatchHooksTransformer
if(typeof y=="function")y=[y]
if(y.constructor==Array)for(x=0;x<y.length;++x){w=y[x]
if(typeof w=="function")z=w(z)||z}}v=z.getTag
u=z.getUnknownTag
t=z.prototypeForTag
$.bQ=new H.hQ(v)
$.dc=new H.hR(u)
$.dp=new H.hS(t)},
ac:function(a,b){return a(b)||b},
e_:{"^":"cS;a,$ti",$ascS:I.t,$asW:I.t,$isW:1},
dZ:{"^":"b;",
gw:function(a){return this.gk(this)===0},
i:function(a){return P.cf(this)},
n:function(a,b,c){return H.e0()},
$isW:1},
e1:{"^":"dZ;a,b,c,$ti",
gk:function(a){return this.a},
am:function(a){if(typeof a!=="string")return!1
if("__proto__"===a)return!1
return this.b.hasOwnProperty(a)},
h:function(a,b){if(!this.am(b))return
return this.bg(b)},
bg:function(a){return this.b[a]},
S:function(a,b){var z,y,x,w
z=this.c
for(y=z.length,x=0;x<y;++x){w=z[x]
b.$2(w,this.bg(w))}}},
ey:{"^":"b;a,b,c,d,e,f",
gbR:function(){return this.a},
gbW:function(){var z,y,x,w
if(this.c===1)return C.k
z=this.d
y=z.length-this.e.length
if(y===0)return C.k
x=[]
for(w=0;w<y;++w){if(w>=z.length)return H.e(z,w)
x.push(z[w])}x.fixed$length=Array
x.immutable$list=Array
return x},
gbS:function(){var z,y,x,w,v,u,t,s,r
if(this.c!==0)return C.l
z=this.e
y=z.length
x=this.d
w=x.length-y
if(y===0)return C.l
v=P.aJ
u=new H.U(0,null,null,null,null,null,0,[v,null])
for(t=0;t<y;++t){if(t>=z.length)return H.e(z,t)
s=z[t]
r=w+t
if(r<0||r>=x.length)return H.e(x,r)
u.n(0,new H.bx(s),x[r])}return new H.e_(u,[v,null])}},
f_:{"^":"b;a,b,c,d,e,f,r,x",
dh:function(a,b){var z=this.d
if(typeof b!=="number")return b.a2()
if(b<z)return
return this.b[3+b-z]},
l:{
cx:function(a){var z,y,x
z=a.$reflectionInfo
if(z==null)return
z.fixed$length=Array
z=z
y=z[0]
x=z[1]
return new H.f_(a,z,(y&1)===1,y>>1,x>>1,(x&1)===1,z[2],null)}}},
eY:{"^":"f:7;a,b,c",
$2:function(a,b){var z=this.a
z.b=z.b+"$"+H.a(a)
this.c.push(a)
this.b.push(b);++z.a}},
fl:{"^":"b;a,b,c,d,e,f",
D:function(a){var z,y,x
z=new RegExp(this.a).exec(a)
if(z==null)return
y=Object.create(null)
x=this.b
if(x!==-1)y.arguments=z[x+1]
x=this.c
if(x!==-1)y.argumentsExpr=z[x+1]
x=this.d
if(x!==-1)y.expr=z[x+1]
x=this.e
if(x!==-1)y.method=z[x+1]
x=this.f
if(x!==-1)y.receiver=z[x+1]
return y},
l:{
M:function(a){var z,y,x,w,v,u
a=a.replace(String({}),'$receiver$').replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
z=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(z==null)z=[]
y=z.indexOf("\\$arguments\\$")
x=z.indexOf("\\$argumentsExpr\\$")
w=z.indexOf("\\$expr\\$")
v=z.indexOf("\\$method\\$")
u=z.indexOf("\\$receiver\\$")
return new H.fl(a.replace(new RegExp('\\\\\\$arguments\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$argumentsExpr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$expr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$method\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$receiver\\\\\\$','g'),'((?:x|[^x])*)'),y,x,w,v,u)},
b7:function(a){return function($expr$){var $argumentsExpr$='$arguments$'
try{$expr$.$method$($argumentsExpr$)}catch(z){return z.message}}(a)},
cM:function(a){return function($expr$){try{$expr$.$method$}catch(z){return z.message}}(a)}}},
cm:{"^":"u;a,b",
i:function(a){var z=this.b
if(z==null)return"NullError: "+H.a(this.a)
return"NullError: method not found: '"+H.a(z)+"' on null"}},
eE:{"^":"u;a,b,c",
i:function(a){var z,y
z=this.b
if(z==null)return"NoSuchMethodError: "+H.a(this.a)
y=this.c
if(y==null)return"NoSuchMethodError: method not found: '"+H.a(z)+"' ("+H.a(this.a)+")"
return"NoSuchMethodError: method not found: '"+H.a(z)+"' on '"+H.a(y)+"' ("+H.a(this.a)+")"},
l:{
bq:function(a,b){var z,y
z=b==null
y=z?null:b.method
return new H.eE(a,y,z?null:b.receiver)}}},
fm:{"^":"u;a",
i:function(a){var z=this.a
return z.length===0?"Error":"Error: "+z}},
ia:{"^":"f:1;a",
$1:function(a){if(!!J.j(a).$isu)if(a.$thrownJsError==null)a.$thrownJsError=this.a
return a}},
d0:{"^":"b;a,b",
i:function(a){var z,y
z=this.b
if(z!=null)return z
z=this.a
y=z!==null&&typeof z==="object"?z.stack:null
z=y==null?"":y
this.b=z
return z}},
hW:{"^":"f:0;a",
$0:function(){return this.a.$0()}},
hX:{"^":"f:0;a,b",
$0:function(){return this.a.$1(this.b)}},
hY:{"^":"f:0;a,b,c",
$0:function(){return this.a.$2(this.b,this.c)}},
hZ:{"^":"f:0;a,b,c,d",
$0:function(){return this.a.$3(this.b,this.c,this.d)}},
i_:{"^":"f:0;a,b,c,d,e",
$0:function(){return this.a.$4(this.b,this.c,this.d,this.e)}},
f:{"^":"b;",
i:function(a){return"Closure '"+H.cs(this)+"'"},
gc8:function(){return this},
$isbn:1,
gc8:function(){return this}},
cB:{"^":"f;"},
f7:{"^":"cB;",
i:function(a){var z=this.$static_name
if(z==null)return"Closure of unknown static method"
return"Closure '"+z+"'"}},
bl:{"^":"cB;a,b,c,d",
m:function(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof H.bl))return!1
return this.a===b.a&&this.b===b.b&&this.c===b.c},
gp:function(a){var z,y
z=this.c
if(z==null)y=H.Y(this.a)
else y=typeof z!=="object"?J.N(z):H.Y(z)
return J.dy(y,H.Y(this.b))},
i:function(a){var z=this.c
if(z==null)z=this.a
return"Closure '"+H.a(this.d)+"' of "+H.b2(z)},
l:{
bm:function(a){return a.a},
c0:function(a){return a.c},
dT:function(){var z=$.ag
if(z==null){z=H.aT("self")
$.ag=z}return z},
aT:function(a){var z,y,x,w,v
z=new H.bl("self","target","receiver","name")
y=Object.getOwnPropertyNames(z)
y.fixed$length=Array
x=y
for(y=x.length,w=0;w<y;++w){v=x[w]
if(z[v]===a)return v}}}},
f0:{"^":"u;a",
i:function(a){return"RuntimeError: "+H.a(this.a)}},
b5:{"^":"b;"},
f1:{"^":"b5;a,b,c,d",
H:function(a){var z=H.hL(a)
return z==null?!1:H.di(z,this.G())},
G:function(){var z,y,x,w,v,u,t
z={func:"dynafunc"}
y=this.a
x=J.j(y)
if(!!x.$isj7)z.v=true
else if(!x.$isc3)z.ret=y.G()
y=this.b
if(y!=null&&y.length!==0)z.args=H.cy(y)
y=this.c
if(y!=null&&y.length!==0)z.opt=H.cy(y)
y=this.d
if(y!=null){w=Object.create(null)
v=H.bM(y)
for(x=v.length,u=0;u<x;++u){t=v[u]
w[t]=y[t].G()}z.named=w}return z},
i:function(a){var z,y,x,w,v,u,t,s
z=this.b
if(z!=null)for(y=z.length,x="(",w=!1,v=0;v<y;++v,w=!0){u=z[v]
if(w)x+=", "
x+=H.a(u)}else{x="("
w=!1}z=this.c
if(z!=null&&z.length!==0){x=(w?x+", ":x)+"["
for(y=z.length,w=!1,v=0;v<y;++v,w=!0){u=z[v]
if(w)x+=", "
x+=H.a(u)}x+="]"}else{z=this.d
if(z!=null){x=(w?x+", ":x)+"{"
t=H.bM(z)
for(y=t.length,w=!1,v=0;v<y;++v,w=!0){s=t[v]
if(w)x+=", "
x+=H.a(z[s].G())+" "+s}x+="}"}}return x+(") -> "+H.a(this.a))},
l:{
cy:function(a){var z,y,x
a=a
z=[]
for(y=a.length,x=0;x<y;++x)z.push(a[x].G())
return z}}},
c3:{"^":"b5;",
i:function(a){return"dynamic"},
G:function(){return}},
f3:{"^":"b5;a",
G:function(){var z,y
z=this.a
y=H.dl(z)
if(y==null)throw H.c("no type for '"+z+"'")
return y},
i:function(a){return this.a}},
f2:{"^":"b5;a,b,c",
G:function(){var z,y,x,w
z=this.c
if(z!=null)return z
z=this.a
y=[H.dl(z)]
if(0>=y.length)return H.e(y,0)
if(y[0]==null)throw H.c("no type for '"+z+"<...>'")
for(z=this.b,x=z.length,w=0;w<z.length;z.length===x||(0,H.aQ)(z),++w)y.push(z[w].G())
this.c=y
return y},
i:function(a){var z=this.b
return this.a+"<"+(z&&C.c).dO(z,", ")+">"}},
U:{"^":"b;a,b,c,d,e,f,r,$ti",
gk:function(a){return this.a},
gw:function(a){return this.a===0},
gbO:function(){return new H.eK(this,[H.ae(this,0)])},
gc4:function(a){return H.b_(this.gbO(),new H.eD(this),H.ae(this,0),H.ae(this,1))},
am:function(a){var z,y
if(typeof a==="string"){z=this.b
if(z==null)return!1
return this.bd(z,a)}else if(typeof a==="number"&&(a&0x3ffffff)===a){y=this.c
if(y==null)return!1
return this.bd(y,a)}else return this.dK(a)},
dK:function(a){var z=this.d
if(z==null)return!1
return this.ad(this.ak(z,this.ac(a)),a)>=0},
h:function(a,b){var z,y,x
if(typeof b==="string"){z=this.b
if(z==null)return
y=this.a5(z,b)
return y==null?null:y.gT()}else if(typeof b==="number"&&(b&0x3ffffff)===b){x=this.c
if(x==null)return
y=this.a5(x,b)
return y==null?null:y.gT()}else return this.dL(b)},
dL:function(a){var z,y,x
z=this.d
if(z==null)return
y=this.ak(z,this.ac(a))
x=this.ad(y,a)
if(x<0)return
return y[x].gT()},
n:function(a,b,c){var z,y,x,w,v,u
if(typeof b==="string"){z=this.b
if(z==null){z=this.aI()
this.b=z}this.b4(z,b,c)}else if(typeof b==="number"&&(b&0x3ffffff)===b){y=this.c
if(y==null){y=this.aI()
this.c=y}this.b4(y,b,c)}else{x=this.d
if(x==null){x=this.aI()
this.d=x}w=this.ac(b)
v=this.ak(x,w)
if(v==null)this.aK(x,w,[this.aJ(b,c)])
else{u=this.ad(v,b)
if(u>=0)v[u].sT(c)
else v.push(this.aJ(b,c))}}},
af:function(a,b){if(typeof b==="string")return this.bt(this.b,b)
else if(typeof b==="number"&&(b&0x3ffffff)===b)return this.bt(this.c,b)
else return this.dM(b)},
dM:function(a){var z,y,x,w
z=this.d
if(z==null)return
y=this.ak(z,this.ac(a))
x=this.ad(y,a)
if(x<0)return
w=y.splice(x,1)[0]
this.bB(w)
return w.gT()},
a0:function(a){if(this.a>0){this.f=null
this.e=null
this.d=null
this.c=null
this.b=null
this.a=0
this.r=this.r+1&67108863}},
S:function(a,b){var z,y
z=this.e
y=this.r
for(;z!=null;){b.$2(z.a,z.b)
if(y!==this.r)throw H.c(new P.ah(this))
z=z.c}},
b4:function(a,b,c){var z=this.a5(a,b)
if(z==null)this.aK(a,b,this.aJ(b,c))
else z.sT(c)},
bt:function(a,b){var z
if(a==null)return
z=this.a5(a,b)
if(z==null)return
this.bB(z)
this.be(a,b)
return z.gT()},
aJ:function(a,b){var z,y
z=new H.eJ(a,b,null,null)
if(this.e==null){this.f=z
this.e=z}else{y=this.f
z.d=y
y.c=z
this.f=z}++this.a
this.r=this.r+1&67108863
return z},
bB:function(a){var z,y
z=a.gd1()
y=a.gd0()
if(z==null)this.e=y
else z.c=y
if(y==null)this.f=z
else y.d=z;--this.a
this.r=this.r+1&67108863},
ac:function(a){return J.N(a)&0x3ffffff},
ad:function(a,b){var z,y
if(a==null)return-1
z=a.length
for(y=0;y<z;++y)if(J.R(a[y].gbN(),b))return y
return-1},
i:function(a){return P.cf(this)},
a5:function(a,b){return a[b]},
ak:function(a,b){return a[b]},
aK:function(a,b,c){a[b]=c},
be:function(a,b){delete a[b]},
bd:function(a,b){return this.a5(a,b)!=null},
aI:function(){var z=Object.create(null)
this.aK(z,"<non-identifier-key>",z)
this.be(z,"<non-identifier-key>")
return z},
$isel:1,
$isW:1},
eD:{"^":"f:1;a",
$1:[function(a){return this.a.h(0,a)},null,null,2,0,null,18,"call"]},
eJ:{"^":"b;bN:a<,T:b@,d0:c<,d1:d<"},
eK:{"^":"h;a,$ti",
gk:function(a){return this.a.a},
gA:function(a){var z,y
z=this.a
y=new H.eL(z,z.r,null,null)
y.c=z.e
return y}},
eL:{"^":"b;a,b,c,d",
gt:function(){return this.d},
q:function(){var z=this.a
if(this.b!==z.r)throw H.c(new P.ah(z))
else{z=this.c
if(z==null){this.d=null
return!1}else{this.d=z.a
this.c=z.c
return!0}}}},
hQ:{"^":"f:1;a",
$1:function(a){return this.a(a)}},
hR:{"^":"f:8;a",
$2:function(a,b){return this.a(a,b)}},
hS:{"^":"f:9;a",
$1:function(a){return this.a(a)}}}],["","",,H,{"^":"",
bM:function(a){var z=H.G(a?Object.keys(a):[],[null])
z.fixed$length=Array
return z}}],["","",,H,{"^":"",
i6:function(a){if(typeof dartPrint=="function"){dartPrint(a)
return}if(typeof console=="object"&&typeof console.log!="undefined"){console.log(a)
return}if(typeof window=="object")return
if(typeof print=="function"){print(a)
return}throw"Unable to print message: "+String(a)}}],["","",,H,{"^":"",cg:{"^":"d;",$iscg:1,"%":"ArrayBuffer"},b1:{"^":"d;",$isb1:1,$isE:1,"%":";ArrayBufferView;bu|ch|cj|bv|ci|ck|X"},iN:{"^":"b1;",$isE:1,"%":"DataView"},bu:{"^":"b1;",
gk:function(a){return a.length},
$isL:1,
$asL:I.t,
$isD:1,
$asD:I.t},bv:{"^":"cj;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
n:function(a,b,c){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
a[b]=c}},ch:{"^":"bu+aF;",$asL:I.t,$asD:I.t,
$asi:function(){return[P.a2]},
$ash:function(){return[P.a2]},
$isi:1,
$ish:1},cj:{"^":"ch+c8;",$asL:I.t,$asD:I.t,
$asi:function(){return[P.a2]},
$ash:function(){return[P.a2]}},X:{"^":"ck;",
n:function(a,b,c){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
a[b]=c},
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]}},ci:{"^":"bu+aF;",$asL:I.t,$asD:I.t,
$asi:function(){return[P.k]},
$ash:function(){return[P.k]},
$isi:1,
$ish:1},ck:{"^":"ci+c8;",$asL:I.t,$asD:I.t,
$asi:function(){return[P.k]},
$ash:function(){return[P.k]}},iO:{"^":"bv;",$isE:1,$isi:1,
$asi:function(){return[P.a2]},
$ish:1,
$ash:function(){return[P.a2]},
"%":"Float32Array"},iP:{"^":"bv;",$isE:1,$isi:1,
$asi:function(){return[P.a2]},
$ish:1,
$ash:function(){return[P.a2]},
"%":"Float64Array"},iQ:{"^":"X;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"Int16Array"},iR:{"^":"X;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"Int32Array"},iS:{"^":"X;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"Int8Array"},iT:{"^":"X;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"Uint16Array"},iU:{"^":"X;",
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"Uint32Array"},iV:{"^":"X;",
gk:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":"CanvasPixelArray|Uint8ClampedArray"},iW:{"^":"X;",
gk:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)H.p(H.r(a,b))
return a[b]},
$isE:1,
$isi:1,
$asi:function(){return[P.k]},
$ish:1,
$ash:function(){return[P.k]},
"%":";Uint8Array"}}],["","",,P,{"^":"",
fs:function(){var z,y,x
z={}
if(self.scheduleImmediate!=null)return P.hB()
if(self.MutationObserver!=null&&self.document!=null){y=self.document.createElement("div")
x=self.document.createElement("span")
z.a=null
new self.MutationObserver(H.ad(new P.fu(z),1)).observe(y,{childList:true})
return new P.ft(z,y,x)}else if(self.setImmediate!=null)return P.hC()
return P.hD()},
j8:[function(a){++init.globalState.f.b
self.scheduleImmediate(H.ad(new P.fv(a),0))},"$1","hB",2,0,3],
j9:[function(a){++init.globalState.f.b
self.setImmediate(H.ad(new P.fw(a),0))},"$1","hC",2,0,3],
ja:[function(a){P.by(C.f,a)},"$1","hD",2,0,3],
hp:function(a,b,c){var z=H.ap()
if(H.a1(z,[z,z]).H(a))return a.$2(b,c)
else return a.$1(b)},
d6:function(a,b){var z=H.ap()
if(H.a1(z,[z,z]).H(a)){b.toString
return a}else{b.toString
return a}},
hr:function(){var z,y
for(;z=$.ab,z!=null;){$.al=null
y=z.b
$.ab=y
if(y==null)$.ak=null
z.a.$0()}},
jo:[function(){$.bI=!0
try{P.hr()}finally{$.al=null
$.bI=!1
if($.ab!=null)$.$get$bA().$1(P.de())}},"$0","de",0,0,2],
da:function(a){var z=new P.cT(a,null)
if($.ab==null){$.ak=z
$.ab=z
if(!$.bI)$.$get$bA().$1(P.de())}else{$.ak.b=z
$.ak=z}},
hu:function(a){var z,y,x
z=$.ab
if(z==null){P.da(a)
$.al=$.ak
return}y=new P.cT(a,null)
x=$.al
if(x==null){y.b=z
$.al=y
$.ab=y}else{y.b=x.b
x.b=y
$.al=y
if(y.b==null)$.ak=y}},
dq:function(a){var z=$.l
if(C.b===z){P.an(null,null,C.b,a)
return}z.toString
P.an(null,null,z,z.aM(a,!0))},
jm:[function(a){},"$1","hE",2,0,15,7],
hs:[function(a,b){var z=$.l
z.toString
P.am(null,null,z,a,b)},function(a){return P.hs(a,null)},"$2","$1","hG",2,2,4,2,0,1],
jn:[function(){},"$0","hF",0,0,2],
d1:function(a,b,c){$.l.toString
a.a4(b,c)},
fj:function(a,b){var z=$.l
if(z===C.b){z.toString
return P.by(a,b)}return P.by(a,z.aM(b,!0))},
fk:function(a,b){var z,y
z=$.l
if(z===C.b){z.toString
return P.cE(a,b)}y=z.bF(b,!0)
$.l.toString
return P.cE(a,y)},
by:function(a,b){var z=C.a.Z(a.a,1000)
return H.fe(z<0?0:z,b)},
cE:function(a,b){var z=C.a.Z(a.a,1000)
return H.ff(z<0?0:z,b)},
fr:function(){return $.l},
am:function(a,b,c,d,e){var z={}
z.a=d
P.hu(new P.ht(z,e))},
d7:function(a,b,c,d){var z,y
y=$.l
if(y===c)return d.$0()
$.l=c
z=y
try{y=d.$0()
return y}finally{$.l=z}},
d9:function(a,b,c,d,e){var z,y
y=$.l
if(y===c)return d.$1(e)
$.l=c
z=y
try{y=d.$1(e)
return y}finally{$.l=z}},
d8:function(a,b,c,d,e,f){var z,y
y=$.l
if(y===c)return d.$2(e,f)
$.l=c
z=y
try{y=d.$2(e,f)
return y}finally{$.l=z}},
an:function(a,b,c,d){var z=C.b!==c
if(z)d=c.aM(d,!(!z||!1))
P.da(d)},
fu:{"^":"f:1;a",
$1:[function(a){var z,y;--init.globalState.f.b
z=this.a
y=z.a
z.a=null
y.$0()},null,null,2,0,null,3,"call"]},
ft:{"^":"f:10;a,b,c",
$1:function(a){var z,y;++init.globalState.f.b
this.a.a=a
z=this.b
y=this.c
z.firstChild?z.removeChild(y):z.appendChild(y)}},
fv:{"^":"f:0;a",
$0:[function(){--init.globalState.f.b
this.a.$0()},null,null,0,0,null,"call"]},
fw:{"^":"f:0;a",
$0:[function(){--init.globalState.f.b
this.a.$0()},null,null,0,0,null,"call"]},
a6:{"^":"b;$ti"},
cX:{"^":"b;I:a@,u:b>,c,d,e",
ga_:function(){return this.b.b},
gbM:function(){return(this.c&1)!==0},
gdH:function(){return(this.c&2)!==0},
gbL:function(){return this.c===8},
gdI:function(){return this.e!=null},
dF:function(a){return this.b.b.aW(this.d,a)},
dQ:function(a){if(this.c!==6)return!0
return this.b.b.aW(this.d,J.as(a))},
bK:function(a){var z,y,x,w
z=this.e
y=H.ap()
x=J.o(a)
w=this.b.b
if(H.a1(y,[y,y]).H(z))return w.dZ(z,x.gR(a),a.gV())
else return w.aW(z,x.gR(a))},
dG:function(){return this.b.b.c_(this.d)}},
a8:{"^":"b;O:a<,a_:b<,Y:c<,$ti",
gcY:function(){return this.a===2},
gaH:function(){return this.a>=4},
gcX:function(){return this.a===8},
d5:function(a){this.a=2
this.c=a},
c2:function(a,b){var z,y
z=$.l
if(z!==C.b){z.toString
if(b!=null)b=P.d6(b,z)}y=new P.a8(0,$.l,null,[null])
this.au(new P.cX(null,y,b==null?1:3,a,b))
return y},
e0:function(a){return this.c2(a,null)},
c5:function(a){var z,y
z=$.l
y=new P.a8(0,z,null,this.$ti)
if(z!==C.b)z.toString
this.au(new P.cX(null,y,8,a,null))
return y},
d7:function(){this.a=1},
cQ:function(){this.a=0},
gM:function(){return this.c},
gcP:function(){return this.c},
d8:function(a){this.a=4
this.c=a},
d6:function(a){this.a=8
this.c=a},
b6:function(a){this.a=a.gO()
this.c=a.gY()},
au:function(a){var z,y
z=this.a
if(z<=1){a.a=this.c
this.c=a}else{if(z===2){y=this.c
if(!y.gaH()){y.au(a)
return}this.a=y.gO()
this.c=y.gY()}z=this.b
z.toString
P.an(null,null,z,new P.fJ(this,a))}},
bs:function(a){var z,y,x,w,v
z={}
z.a=a
if(a==null)return
y=this.a
if(y<=1){x=this.c
this.c=a
if(x!=null){for(w=a;w.gI()!=null;)w=w.gI()
w.sI(x)}}else{if(y===2){v=this.c
if(!v.gaH()){v.bs(a)
return}this.a=v.gO()
this.c=v.gY()}z.a=this.bu(a)
y=this.b
y.toString
P.an(null,null,y,new P.fQ(z,this))}},
X:function(){var z=this.c
this.c=null
return this.bu(z)},
bu:function(a){var z,y,x
for(z=a,y=null;z!=null;y=z,z=x){x=z.gI()
z.sI(y)}return y},
aB:function(a){var z
if(!!J.j(a).$isa6)P.bb(a,this)
else{z=this.X()
this.a=4
this.c=a
P.a9(this,z)}},
aC:[function(a,b){var z=this.X()
this.a=8
this.c=new P.aS(a,b)
P.a9(this,z)},function(a){return this.aC(a,null)},"e8","$2","$1","gbc",2,2,4,2,0,1],
cO:function(a){var z
if(!!J.j(a).$isa6){if(a.a===8){this.a=1
z=this.b
z.toString
P.an(null,null,z,new P.fK(this,a))}else P.bb(a,this)
return}this.a=1
z=this.b
z.toString
P.an(null,null,z,new P.fL(this,a))},
cK:function(a,b){this.cO(a)},
$isa6:1,
l:{
fM:function(a,b){var z,y,x,w
b.d7()
try{a.c2(new P.fN(b),new P.fO(b))}catch(x){w=H.z(x)
z=w
y=H.B(x)
P.dq(new P.fP(b,z,y))}},
bb:function(a,b){var z
for(;a.gcY();)a=a.gcP()
if(a.gaH()){z=b.X()
b.b6(a)
P.a9(b,z)}else{z=b.gY()
b.d5(a)
a.bs(z)}},
a9:function(a,b){var z,y,x,w,v,u,t,s,r,q,p
z={}
z.a=a
for(y=a;!0;){x={}
w=y.gcX()
if(b==null){if(w){v=z.a.gM()
y=z.a.ga_()
x=J.as(v)
u=v.gV()
y.toString
P.am(null,null,y,x,u)}return}for(;b.gI()!=null;b=t){t=b.gI()
b.sI(null)
P.a9(z.a,b)}s=z.a.gY()
x.a=w
x.b=s
y=!w
if(!y||b.gbM()||b.gbL()){r=b.ga_()
if(w){u=z.a.ga_()
u.toString
u=u==null?r==null:u===r
if(!u)r.toString
else u=!0
u=!u}else u=!1
if(u){v=z.a.gM()
y=z.a.ga_()
x=J.as(v)
u=v.gV()
y.toString
P.am(null,null,y,x,u)
return}q=$.l
if(q==null?r!=null:q!==r)$.l=r
else q=null
if(b.gbL())new P.fT(z,x,w,b).$0()
else if(y){if(b.gbM())new P.fS(x,b,s).$0()}else if(b.gdH())new P.fR(z,x,b).$0()
if(q!=null)$.l=q
y=x.b
u=J.j(y)
if(!!u.$isa6){p=J.bV(b)
if(!!u.$isa8)if(y.a>=4){b=p.X()
p.b6(y)
z.a=y
continue}else P.bb(y,p)
else P.fM(y,p)
return}}p=J.bV(b)
b=p.X()
y=x.a
x=x.b
if(!y)p.d8(x)
else p.d6(x)
z.a=p
y=p}}}},
fJ:{"^":"f:0;a,b",
$0:function(){P.a9(this.a,this.b)}},
fQ:{"^":"f:0;a,b",
$0:function(){P.a9(this.b,this.a.a)}},
fN:{"^":"f:1;a",
$1:[function(a){var z=this.a
z.cQ()
z.aB(a)},null,null,2,0,null,7,"call"]},
fO:{"^":"f:11;a",
$2:[function(a,b){this.a.aC(a,b)},function(a){return this.$2(a,null)},"$1",null,null,null,2,2,null,2,0,1,"call"]},
fP:{"^":"f:0;a,b,c",
$0:[function(){this.a.aC(this.b,this.c)},null,null,0,0,null,"call"]},
fK:{"^":"f:0;a,b",
$0:function(){P.bb(this.b,this.a)}},
fL:{"^":"f:0;a,b",
$0:function(){var z,y
z=this.a
y=z.X()
z.a=4
z.c=this.b
P.a9(z,y)}},
fT:{"^":"f:2;a,b,c,d",
$0:function(){var z,y,x,w,v,u,t
z=null
try{z=this.d.dG()}catch(w){v=H.z(w)
y=v
x=H.B(w)
if(this.c){v=J.as(this.a.a.gM())
u=y
u=v==null?u==null:v===u
v=u}else v=!1
u=this.b
if(v)u.b=this.a.a.gM()
else u.b=new P.aS(y,x)
u.a=!0
return}if(!!J.j(z).$isa6){if(z instanceof P.a8&&z.gO()>=4){if(z.gO()===8){v=this.b
v.b=z.gY()
v.a=!0}return}t=this.a.a
v=this.b
v.b=z.e0(new P.fU(t))
v.a=!1}}},
fU:{"^":"f:1;a",
$1:[function(a){return this.a},null,null,2,0,null,3,"call"]},
fS:{"^":"f:2;a,b,c",
$0:function(){var z,y,x,w
try{this.a.b=this.b.dF(this.c)}catch(x){w=H.z(x)
z=w
y=H.B(x)
w=this.a
w.b=new P.aS(z,y)
w.a=!0}}},
fR:{"^":"f:2;a,b,c",
$0:function(){var z,y,x,w,v,u,t,s
try{z=this.a.a.gM()
w=this.c
if(w.dQ(z)===!0&&w.gdI()){v=this.b
v.b=w.bK(z)
v.a=!1}}catch(u){w=H.z(u)
y=w
x=H.B(u)
w=this.a
v=J.as(w.a.gM())
t=y
s=this.b
if(v==null?t==null:v===t)s.b=w.a.gM()
else s.b=new P.aS(y,x)
s.a=!0}}},
cT:{"^":"b;a,b"},
a_:{"^":"b;$ti",
a1:function(a,b){return new P.h8(b,this,[H.x(this,"a_",0),null])},
dB:function(a,b){return new P.fV(a,b,this,[H.x(this,"a_",0)])},
bK:function(a){return this.dB(a,null)},
gk:function(a){var z,y
z={}
y=new P.a8(0,$.l,null,[P.k])
z.a=0
this.ae(new P.f9(z),!0,new P.fa(z,y),y.gbc())
return y},
aZ:function(a){var z,y,x
z=H.x(this,"a_",0)
y=H.G([],[z])
x=new P.a8(0,$.l,null,[[P.i,z]])
this.ae(new P.fb(this,y),!0,new P.fc(y,x),x.gbc())
return x}},
f9:{"^":"f:1;a",
$1:[function(a){++this.a.a},null,null,2,0,null,3,"call"]},
fa:{"^":"f:0;a,b",
$0:[function(){this.b.aB(this.a.a)},null,null,0,0,null,"call"]},
fb:{"^":"f;a,b",
$1:[function(a){this.b.push(a)},null,null,2,0,null,8,"call"],
$signature:function(){return H.dg(function(a){return{func:1,args:[a]}},this.a,"a_")}},
fc:{"^":"f:0;a,b",
$0:[function(){this.b.aB(this.a)},null,null,0,0,null,"call"]},
f8:{"^":"b;"},
je:{"^":"b;"},
b8:{"^":"b;a_:d<,O:e<,$ti",
aT:function(a,b){var z=this.e
if((z&8)!==0)return
this.e=(z+128|4)>>>0
if(z<128&&this.r!=null)this.r.bH()
if((z&4)===0&&(this.e&32)===0)this.bi(this.gbo())},
bV:function(a){return this.aT(a,null)},
bZ:function(){var z=this.e
if((z&8)!==0)return
if(z>=128){z-=128
this.e=z
if(z<128){if((z&64)!==0){z=this.r
z=!z.gw(z)}else z=!1
if(z)this.r.as(this)
else{z=(this.e&4294967291)>>>0
this.e=z
if((z&32)===0)this.bi(this.gbq())}}}},
al:function(){var z=(this.e&4294967279)>>>0
this.e=z
if((z&8)===0)this.ax()
z=this.f
return z==null?$.$get$aX():z},
gaP:function(){return this.e>=128},
ax:function(){var z=(this.e|8)>>>0
this.e=z
if((z&64)!==0)this.r.bH()
if((this.e&32)===0)this.r=null
this.f=this.bn()},
aw:["cA",function(a){var z=this.e
if((z&8)!==0)return
if(z<32)this.bw(a)
else this.av(new P.fz(a,null,[H.x(this,"b8",0)]))}],
a4:["cB",function(a,b){var z=this.e
if((z&8)!==0)return
if(z<32)this.by(a,b)
else this.av(new P.fB(a,b,null))}],
cN:function(){var z=this.e
if((z&8)!==0)return
z=(z|2)>>>0
this.e=z
if(z<32)this.bx()
else this.av(C.o)},
bp:[function(){},"$0","gbo",0,0,2],
br:[function(){},"$0","gbq",0,0,2],
bn:function(){return},
av:function(a){var z,y
z=this.r
if(z==null){z=new P.hg(null,null,0,[H.x(this,"b8",0)])
this.r=z}z.v(0,a)
y=this.e
if((y&64)===0){y=(y|64)>>>0
this.e=y
if(y<128)this.r.as(this)}},
bw:function(a){var z=this.e
this.e=(z|32)>>>0
this.d.aX(this.a,a)
this.e=(this.e&4294967263)>>>0
this.az((z&4)!==0)},
by:function(a,b){var z,y,x
z=this.e
y=new P.fy(this,a,b)
if((z&1)!==0){this.e=(z|16)>>>0
this.ax()
z=this.f
if(!!J.j(z).$isa6){x=$.$get$aX()
x=z==null?x!=null:z!==x}else x=!1
if(x)z.c5(y)
else y.$0()}else{y.$0()
this.az((z&4)!==0)}},
bx:function(){var z,y,x
z=new P.fx(this)
this.ax()
this.e=(this.e|16)>>>0
y=this.f
if(!!J.j(y).$isa6){x=$.$get$aX()
x=y==null?x!=null:y!==x}else x=!1
if(x)y.c5(z)
else z.$0()},
bi:function(a){var z=this.e
this.e=(z|32)>>>0
a.$0()
this.e=(this.e&4294967263)>>>0
this.az((z&4)!==0)},
az:function(a){var z,y
if((this.e&64)!==0){z=this.r
z=z.gw(z)}else z=!1
if(z){z=(this.e&4294967231)>>>0
this.e=z
if((z&4)!==0)if(z<128){z=this.r
z=z==null||z.gw(z)}else z=!1
else z=!1
if(z)this.e=(this.e&4294967291)>>>0}for(;!0;a=y){z=this.e
if((z&8)!==0){this.r=null
return}y=(z&4)!==0
if(a===y)break
this.e=(z^32)>>>0
if(y)this.bp()
else this.br()
this.e=(this.e&4294967263)>>>0}z=this.e
if((z&64)!==0&&z<128)this.r.as(this)},
cH:function(a,b,c,d,e){var z,y
z=a==null?P.hE():a
y=this.d
y.toString
this.a=z
this.b=P.d6(b==null?P.hG():b,y)
this.c=c==null?P.hF():c}},
fy:{"^":"f:2;a,b,c",
$0:[function(){var z,y,x,w,v,u
z=this.a
y=z.e
if((y&8)!==0&&(y&16)===0)return
z.e=(y|32)>>>0
y=z.b
x=H.a1(H.ap(),[H.df(P.b),H.df(P.aH)]).H(y)
w=z.d
v=this.b
u=z.b
if(x)w.e_(u,v,this.c)
else w.aX(u,v)
z.e=(z.e&4294967263)>>>0},null,null,0,0,null,"call"]},
fx:{"^":"f:2;a",
$0:[function(){var z,y
z=this.a
y=z.e
if((y&16)===0)return
z.e=(y|42)>>>0
z.d.c0(z.c)
z.e=(z.e&4294967263)>>>0},null,null,0,0,null,"call"]},
cV:{"^":"b;ao:a@"},
fz:{"^":"cV;b,a,$ti",
aU:function(a){a.bw(this.b)}},
fB:{"^":"cV;R:b>,V:c<,a",
aU:function(a){a.by(this.b,this.c)}},
fA:{"^":"b;",
aU:function(a){a.bx()},
gao:function(){return},
sao:function(a){throw H.c(new P.b6("No events after a done."))}},
ha:{"^":"b;O:a<",
as:function(a){var z=this.a
if(z===1)return
if(z>=1){this.a=1
return}P.dq(new P.hb(this,a))
this.a=1},
bH:function(){if(this.a===1)this.a=3}},
hb:{"^":"f:0;a,b",
$0:[function(){var z,y,x,w
z=this.a
y=z.a
z.a=0
if(y===3)return
x=z.b
w=x.gao()
z.b=w
if(w==null)z.c=null
x.aU(this.b)},null,null,0,0,null,"call"]},
hg:{"^":"ha;b,c,a,$ti",
gw:function(a){return this.c==null},
v:function(a,b){var z=this.c
if(z==null){this.c=b
this.b=b}else{z.sao(b)
this.c=b}}},
aL:{"^":"a_;$ti",
ae:function(a,b,c,d){return this.cT(a,d,c,!0===b)},
bP:function(a,b,c){return this.ae(a,null,b,c)},
cT:function(a,b,c,d){return P.fI(this,a,b,c,d,H.x(this,"aL",0),H.x(this,"aL",1))},
bj:function(a,b){b.aw(a)},
bk:function(a,b,c){c.a4(a,b)},
$asa_:function(a,b){return[b]}},
cW:{"^":"b8;x,y,a,b,c,d,e,f,r,$ti",
aw:function(a){if((this.e&2)!==0)return
this.cA(a)},
a4:function(a,b){if((this.e&2)!==0)return
this.cB(a,b)},
bp:[function(){var z=this.y
if(z==null)return
z.bV(0)},"$0","gbo",0,0,2],
br:[function(){var z=this.y
if(z==null)return
z.bZ()},"$0","gbq",0,0,2],
bn:function(){var z=this.y
if(z!=null){this.y=null
return z.al()}return},
e9:[function(a){this.x.bj(a,this)},"$1","gcU",2,0,function(){return H.dg(function(a,b){return{func:1,v:true,args:[a]}},this.$receiver,"cW")},8],
eb:[function(a,b){this.x.bk(a,b,this)},"$2","gcW",4,0,12,0,1],
ea:[function(){this.cN()},"$0","gcV",0,0,2],
cJ:function(a,b,c,d,e,f,g){this.y=this.x.a.bP(this.gcU(),this.gcV(),this.gcW())},
$asb8:function(a,b){return[b]},
l:{
fI:function(a,b,c,d,e,f,g){var z,y
z=$.l
y=e?1:0
y=new P.cW(a,null,null,null,null,z,y,null,null,[f,g])
y.cH(b,c,d,e,g)
y.cJ(a,b,c,d,e,f,g)
return y}}},
h8:{"^":"aL;b,a,$ti",
bj:function(a,b){var z,y,x,w,v
z=null
try{z=this.b.$1(a)}catch(w){v=H.z(w)
y=v
x=H.B(w)
P.d1(b,y,x)
return}b.aw(z)}},
fV:{"^":"aL;b,c,a,$ti",
bk:function(a,b,c){var z,y,x,w,v
z=!0
if(z===!0)try{P.hp(this.b,a,b)}catch(w){v=H.z(w)
y=v
x=H.B(w)
v=y
if(v==null?a==null:v===a)c.a4(a,b)
else P.d1(c,y,x)
return}else c.a4(a,b)},
$asaL:function(a){return[a,a]},
$asa_:null},
cC:{"^":"b;"},
aS:{"^":"b;R:a>,V:b<",
i:function(a){return H.a(this.a)},
$isu:1},
hj:{"^":"b;"},
ht:{"^":"f:0;a,b",
$0:function(){var z,y,x
z=this.a
y=z.a
if(y==null){x=new P.cn()
z.a=x
z=x}else z=y
y=this.b
if(y==null)throw H.c(z)
x=H.c(z)
x.stack=J.a3(y)
throw x}},
hc:{"^":"hj;",
c0:function(a){var z,y,x,w
try{if(C.b===$.l){x=a.$0()
return x}x=P.d7(null,null,this,a)
return x}catch(w){x=H.z(w)
z=x
y=H.B(w)
return P.am(null,null,this,z,y)}},
aX:function(a,b){var z,y,x,w
try{if(C.b===$.l){x=a.$1(b)
return x}x=P.d9(null,null,this,a,b)
return x}catch(w){x=H.z(w)
z=x
y=H.B(w)
return P.am(null,null,this,z,y)}},
e_:function(a,b,c){var z,y,x,w
try{if(C.b===$.l){x=a.$2(b,c)
return x}x=P.d8(null,null,this,a,b,c)
return x}catch(w){x=H.z(w)
z=x
y=H.B(w)
return P.am(null,null,this,z,y)}},
aM:function(a,b){if(b)return new P.hd(this,a)
else return new P.he(this,a)},
bF:function(a,b){return new P.hf(this,a)},
h:function(a,b){return},
c_:function(a){if($.l===C.b)return a.$0()
return P.d7(null,null,this,a)},
aW:function(a,b){if($.l===C.b)return a.$1(b)
return P.d9(null,null,this,a,b)},
dZ:function(a,b,c){if($.l===C.b)return a.$2(b,c)
return P.d8(null,null,this,a,b,c)}},
hd:{"^":"f:0;a,b",
$0:function(){return this.a.c0(this.b)}},
he:{"^":"f:0;a,b",
$0:function(){return this.a.c_(this.b)}},
hf:{"^":"f:1;a,b",
$1:[function(a){return this.a.aX(this.b,a)},null,null,2,0,null,19,"call"]}}],["","",,P,{"^":"",
eM:function(){return new H.U(0,null,null,null,null,null,0,[null,null])},
V:function(a){return H.hM(a,new H.U(0,null,null,null,null,null,0,[null,null]))},
et:function(a,b,c){var z,y
if(P.bJ(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}z=[]
y=$.$get$ao()
y.push(a)
try{P.hq(a,z)}finally{if(0>=y.length)return H.e(y,-1)
y.pop()}y=P.cA(b,z,", ")+c
return y.charCodeAt(0)==0?y:y},
aZ:function(a,b,c){var z,y,x
if(P.bJ(a))return b+"..."+c
z=new P.aI(b)
y=$.$get$ao()
y.push(a)
try{x=z
x.sj(P.cA(x.gj(),a,", "))}finally{if(0>=y.length)return H.e(y,-1)
y.pop()}y=z
y.sj(y.gj()+c)
y=z.gj()
return y.charCodeAt(0)==0?y:y},
bJ:function(a){var z,y
for(z=0;y=$.$get$ao(),z<y.length;++z)if(a===y[z])return!0
return!1},
hq:function(a,b){var z,y,x,w,v,u,t,s,r,q
z=a.gA(a)
y=0
x=0
while(!0){if(!(y<80||x<3))break
if(!z.q())return
w=H.a(z.gt())
b.push(w)
y+=w.length+2;++x}if(!z.q()){if(x<=5)return
if(0>=b.length)return H.e(b,-1)
v=b.pop()
if(0>=b.length)return H.e(b,-1)
u=b.pop()}else{t=z.gt();++x
if(!z.q()){if(x<=4){b.push(H.a(t))
return}v=H.a(t)
if(0>=b.length)return H.e(b,-1)
u=b.pop()
y+=v.length+2}else{s=z.gt();++x
for(;z.q();t=s,s=r){r=z.gt();++x
if(x>100){while(!0){if(!(y>75&&x>3))break
if(0>=b.length)return H.e(b,-1)
y-=b.pop().length+2;--x}b.push("...")
return}}u=H.a(t)
v=H.a(s)
y+=v.length+u.length+4}}if(x>b.length+2){y+=5
q="..."}else q=null
while(!0){if(!(y>80&&b.length>3))break
if(0>=b.length)return H.e(b,-1)
y-=b.pop().length+2
if(q==null){y+=5
q="..."}}if(q!=null)b.push(q)
b.push(u)
b.push(v)},
ai:function(a,b,c,d){return new P.h1(0,null,null,null,null,null,0,[d])},
cf:function(a){var z,y,x
z={}
if(P.bJ(a))return"{...}"
y=new P.aI("")
try{$.$get$ao().push(a)
x=y
x.sj(x.gj()+"{")
z.a=!0
a.S(0,new P.eQ(z,y))
z=y
z.sj(z.gj()+"}")}finally{z=$.$get$ao()
if(0>=z.length)return H.e(z,-1)
z.pop()}z=y.gj()
return z.charCodeAt(0)==0?z:z},
d_:{"^":"U;a,b,c,d,e,f,r,$ti",
ac:function(a){return H.i5(a)&0x3ffffff},
ad:function(a,b){var z,y,x
if(a==null)return-1
z=a.length
for(y=0;y<z;++y){x=a[y].gbN()
if(x==null?b==null:x===b)return y}return-1},
l:{
aj:function(a,b){return new P.d_(0,null,null,null,null,null,0,[a,b])}}},
h1:{"^":"fW;a,b,c,d,e,f,r,$ti",
gA:function(a){var z=new P.cZ(this,this.r,null,null)
z.c=this.e
return z},
gk:function(a){return this.a},
dd:function(a,b){var z,y
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null)return!1
return z[b]!=null}else if(typeof b==="number"&&(b&0x3ffffff)===b){y=this.c
if(y==null)return!1
return y[b]!=null}else return this.cS(b)},
cS:function(a){var z=this.d
if(z==null)return!1
return this.aj(z[this.ai(a)],a)>=0},
bQ:function(a){var z
if(!(typeof a==="string"&&a!=="__proto__"))z=typeof a==="number"&&(a&0x3ffffff)===a
else z=!0
if(z)return this.dd(0,a)?a:null
else return this.cZ(a)},
cZ:function(a){var z,y,x
z=this.d
if(z==null)return
y=z[this.ai(a)]
x=this.aj(y,a)
if(x<0)return
return J.bU(y,x).gaD()},
v:function(a,b){var z,y,x
if(typeof b==="string"&&b!=="__proto__"){z=this.b
if(z==null){y=Object.create(null)
y["<non-identifier-key>"]=y
delete y["<non-identifier-key>"]
this.b=y
z=y}return this.b7(z,b)}else if(typeof b==="number"&&(b&0x3ffffff)===b){x=this.c
if(x==null){y=Object.create(null)
y["<non-identifier-key>"]=y
delete y["<non-identifier-key>"]
this.c=y
x=y}return this.b7(x,b)}else return this.F(b)},
F:function(a){var z,y,x
z=this.d
if(z==null){z=P.h3()
this.d=z}y=this.ai(a)
x=z[y]
if(x==null)z[y]=[this.aA(a)]
else{if(this.aj(x,a)>=0)return!1
x.push(this.aA(a))}return!0},
af:function(a,b){if(typeof b==="string"&&b!=="__proto__")return this.ba(this.b,b)
else if(typeof b==="number"&&(b&0x3ffffff)===b)return this.ba(this.c,b)
else return this.d2(b)},
d2:function(a){var z,y,x
z=this.d
if(z==null)return!1
y=z[this.ai(a)]
x=this.aj(y,a)
if(x<0)return!1
this.bb(y.splice(x,1)[0])
return!0},
a0:function(a){if(this.a>0){this.f=null
this.e=null
this.d=null
this.c=null
this.b=null
this.a=0
this.r=this.r+1&67108863}},
b7:function(a,b){if(a[b]!=null)return!1
a[b]=this.aA(b)
return!0},
ba:function(a,b){var z
if(a==null)return!1
z=a[b]
if(z==null)return!1
this.bb(z)
delete a[b]
return!0},
aA:function(a){var z,y
z=new P.h2(a,null,null)
if(this.e==null){this.f=z
this.e=z}else{y=this.f
z.c=y
y.b=z
this.f=z}++this.a
this.r=this.r+1&67108863
return z},
bb:function(a){var z,y
z=a.gb9()
y=a.gb8()
if(z==null)this.e=y
else z.b=y
if(y==null)this.f=z
else y.sb9(z);--this.a
this.r=this.r+1&67108863},
ai:function(a){return J.N(a)&0x3ffffff},
aj:function(a,b){var z,y
if(a==null)return-1
z=a.length
for(y=0;y<z;++y)if(J.R(a[y].gaD(),b))return y
return-1},
$ish:1,
$ash:null,
l:{
h3:function(){var z=Object.create(null)
z["<non-identifier-key>"]=z
delete z["<non-identifier-key>"]
return z}}},
h2:{"^":"b;aD:a<,b8:b<,b9:c@"},
cZ:{"^":"b;a,b,c,d",
gt:function(){return this.d},
q:function(){var z=this.a
if(this.b!==z.r)throw H.c(new P.ah(z))
else{z=this.c
if(z==null){this.d=null
return!1}else{this.d=z.gaD()
this.c=this.c.gb8()
return!0}}}},
fW:{"^":"f5;$ti"},
aF:{"^":"b;$ti",
gA:function(a){return new H.cd(a,this.gk(a),0,null)},
J:function(a,b){return this.h(a,b)},
a1:function(a,b){return new H.b0(a,b,[H.x(a,"aF",0),null])},
v:function(a,b){var z=this.gk(a)
this.sk(a,z+1)
this.n(a,z,b)},
i:function(a){return P.aZ(a,"[","]")},
$isi:1,
$asi:null,
$ish:1,
$ash:null},
hi:{"^":"b;",
n:function(a,b,c){throw H.c(new P.q("Cannot modify unmodifiable map"))},
$isW:1},
eO:{"^":"b;",
h:function(a,b){return this.a.h(0,b)},
n:function(a,b,c){this.a.n(0,b,c)},
S:function(a,b){this.a.S(0,b)},
gw:function(a){var z=this.a
return z.gw(z)},
gk:function(a){var z=this.a
return z.gk(z)},
i:function(a){return this.a.i(0)},
$isW:1},
cS:{"^":"eO+hi;$ti",$asW:null,$isW:1},
eQ:{"^":"f:5;a,b",
$2:function(a,b){var z,y
z=this.a
if(!z.a)this.b.j+=", "
z.a=!1
z=this.b
y=z.j+=H.a(a)
z.j=y+": "
z.j+=H.a(b)}},
eN:{"^":"aE;a,b,c,d,$ti",
gA:function(a){return new P.h4(this,this.c,this.d,this.b,null)},
gw:function(a){return this.b===this.c},
gk:function(a){return(this.c-this.b&this.a.length-1)>>>0},
J:function(a,b){var z,y,x,w
z=(this.c-this.b&this.a.length-1)>>>0
if(0>b||b>=z)H.p(P.aY(b,this,"index",null,z))
y=this.a
x=y.length
w=(this.b+b&x-1)>>>0
if(w<0||w>=x)return H.e(y,w)
return y[w]},
v:function(a,b){this.F(b)},
a0:function(a){var z,y,x,w,v
z=this.b
y=this.c
if(z!==y){for(x=this.a,w=x.length,v=w-1;z!==y;z=(z+1&v)>>>0){if(z<0||z>=w)return H.e(x,z)
x[z]=null}this.c=0
this.b=0;++this.d}},
i:function(a){return P.aZ(this,"{","}")},
bY:function(){var z,y,x,w
z=this.b
if(z===this.c)throw H.c(H.cb());++this.d
y=this.a
x=y.length
if(z>=x)return H.e(y,z)
w=y[z]
y[z]=null
this.b=(z+1&x-1)>>>0
return w},
F:function(a){var z,y,x
z=this.a
y=this.c
x=z.length
if(y<0||y>=x)return H.e(z,y)
z[y]=a
x=(y+1&x-1)>>>0
this.c=x
if(this.b===x)this.bh();++this.d},
bh:function(){var z,y,x,w
z=new Array(this.a.length*2)
z.fixed$length=Array
y=H.G(z,this.$ti)
z=this.a
x=this.b
w=z.length-x
C.c.b1(y,0,w,z,x)
C.c.b1(y,w,w+this.b,this.a,0)
this.b=0
this.c=this.a.length
this.a=y},
cD:function(a,b){var z=new Array(8)
z.fixed$length=Array
this.a=H.G(z,[b])},
$ash:null,
l:{
bt:function(a,b){var z=new P.eN(null,0,0,0,[b])
z.cD(a,b)
return z}}},
h4:{"^":"b;a,b,c,d,e",
gt:function(){return this.e},
q:function(){var z,y,x
z=this.a
if(this.c!==z.d)H.p(new P.ah(z))
y=this.d
if(y===this.b){this.e=null
return!1}z=z.a
x=z.length
if(y>=x)return H.e(z,y)
this.e=z[y]
this.d=(y+1&x-1)>>>0
return!0}},
f6:{"^":"b;$ti",
a1:function(a,b){return new H.c4(this,b,[H.ae(this,0),null])},
i:function(a){return P.aZ(this,"{","}")},
$ish:1,
$ash:null},
f5:{"^":"f6;$ti"}}],["","",,P,{"^":"",
jl:[function(a){return a.ee()},"$1","hK",2,0,1,4],
dY:{"^":"b;"},
e2:{"^":"b;"},
br:{"^":"u;a,b",
i:function(a){if(this.b!=null)return"Converting object to an encodable object failed."
else return"Converting object did not return an encodable object."}},
eH:{"^":"br;a,b",
i:function(a){return"Cyclic error in JSON stringify"}},
eG:{"^":"dY;a,b",
du:function(a,b){var z=this.gdv()
return P.fZ(a,z.b,z.a)},
dt:function(a){return this.du(a,null)},
gdv:function(){return C.A}},
eI:{"^":"e2;a,b"},
h_:{"^":"b;",
c7:function(a){var z,y,x,w,v,u,t
z=J.F(a)
y=z.gk(a)
if(typeof y!=="number")return H.n(y)
x=this.c
w=0
v=0
for(;v<y;++v){u=z.bJ(a,v)
if(u>92)continue
if(u<32){if(v>w)x.j+=z.a3(a,w,v)
w=v+1
x.j+=H.A(92)
switch(u){case 8:x.j+=H.A(98)
break
case 9:x.j+=H.A(116)
break
case 10:x.j+=H.A(110)
break
case 12:x.j+=H.A(102)
break
case 13:x.j+=H.A(114)
break
default:x.j+=H.A(117)
x.j+=H.A(48)
x.j+=H.A(48)
t=u>>>4&15
x.j+=H.A(t<10?48+t:87+t)
t=u&15
x.j+=H.A(t<10?48+t:87+t)
break}}else if(u===34||u===92){if(v>w)x.j+=z.a3(a,w,v)
w=v+1
x.j+=H.A(92)
x.j+=H.A(u)}}if(w===0)x.j+=H.a(a)
else if(w<y)x.j+=z.a3(a,w,y)},
ay:function(a){var z,y,x,w
for(z=this.a,y=z.length,x=0;x<y;++x){w=z[x]
if(a==null?w==null:a===w)throw H.c(new P.eH(a,null))}z.push(a)},
aq:function(a){var z,y,x,w
if(this.c6(a))return
this.ay(a)
try{z=this.b.$1(a)
if(!this.c6(z))throw H.c(new P.br(a,null))
x=this.a
if(0>=x.length)return H.e(x,-1)
x.pop()}catch(w){x=H.z(w)
y=x
throw H.c(new P.br(a,y))}},
c6:function(a){var z,y
if(typeof a==="number"){if(!isFinite(a))return!1
this.c.j+=C.d.i(a)
return!0}else if(a===!0){this.c.j+="true"
return!0}else if(a===!1){this.c.j+="false"
return!0}else if(a==null){this.c.j+="null"
return!0}else if(typeof a==="string"){z=this.c
z.j+='"'
this.c7(a)
z.j+='"'
return!0}else{z=J.j(a)
if(!!z.$isi){this.ay(a)
this.e6(a)
z=this.a
if(0>=z.length)return H.e(z,-1)
z.pop()
return!0}else if(!!z.$isW){this.ay(a)
y=this.e7(a)
z=this.a
if(0>=z.length)return H.e(z,-1)
z.pop()
return y}else return!1}},
e6:function(a){var z,y,x
z=this.c
z.j+="["
y=J.F(a)
if(y.gk(a)>0){this.aq(y.h(a,0))
for(x=1;x<y.gk(a);++x){z.j+=","
this.aq(y.h(a,x))}}z.j+="]"},
e7:function(a){var z,y,x,w,v,u
z={}
if(a.gw(a)){this.c.j+="{}"
return!0}y=a.gk(a)*2
x=new Array(y)
z.a=0
z.b=!0
a.S(0,new P.h0(z,x))
if(!z.b)return!1
z=this.c
z.j+="{"
for(w='"',v=0;v<y;v+=2,w=',"'){z.j+=w
this.c7(x[v])
z.j+='":'
u=v+1
if(u>=y)return H.e(x,u)
this.aq(x[u])}z.j+="}"
return!0}},
h0:{"^":"f:5;a,b",
$2:function(a,b){var z,y,x,w,v
if(typeof a!=="string")this.a.b=!1
z=this.b
y=this.a
x=y.a
w=x+1
y.a=w
v=z.length
if(x>=v)return H.e(z,x)
z[x]=a
y.a=w+1
if(w>=v)return H.e(z,w)
z[w]=b}},
fY:{"^":"h_;c,a,b",l:{
fZ:function(a,b,c){var z,y,x
z=new P.aI("")
y=P.hK()
x=new P.fY(z,[],y)
x.aq(a)
y=z.j
return y.charCodeAt(0)==0?y:y}}}}],["","",,P,{"^":"",
aw:function(a){if(typeof a==="number"||typeof a==="boolean"||null==a)return J.a3(a)
if(typeof a==="string")return JSON.stringify(a)
return P.eb(a)},
eb:function(a){var z=J.j(a)
if(!!z.$isf)return z.i(a)
return H.b2(a)},
aW:function(a){return new P.fH(a)},
a7:function(a,b,c){var z,y
z=H.G([],[c])
for(y=J.aR(a);y.q();)z.push(y.gt())
return z},
aq:function(a){var z=H.a(a)
H.i6(z)},
eT:{"^":"f:13;a,b",
$2:function(a,b){var z,y,x
z=this.b
y=this.a
z.j+=y.a
x=z.j+=H.a(a.gd_())
z.j=x+": "
z.j+=H.a(P.aw(b))
y.a=", "}},
hH:{"^":"b;"},
"+bool":0,
aV:{"^":"b;a,b",
m:function(a,b){if(b==null)return!1
if(!(b instanceof P.aV))return!1
return this.a===b.a&&this.b===b.b},
gp:function(a){var z=this.a
return(z^C.d.N(z,30))&1073741823},
i:function(a){var z,y,x,w,v,u,t,s
z=this.b
y=P.e6(z?H.y(this).getUTCFullYear()+0:H.y(this).getFullYear()+0)
x=P.av(z?H.y(this).getUTCMonth()+1:H.y(this).getMonth()+1)
w=P.av(z?H.y(this).getUTCDate()+0:H.y(this).getDate()+0)
v=P.av(z?H.y(this).getUTCHours()+0:H.y(this).getHours()+0)
u=P.av(z?H.y(this).getUTCMinutes()+0:H.y(this).getMinutes()+0)
t=P.av(z?H.y(this).getUTCSeconds()+0:H.y(this).getSeconds()+0)
s=P.e7(z?H.y(this).getUTCMilliseconds()+0:H.y(this).getMilliseconds()+0)
if(z)return y+"-"+x+"-"+w+" "+v+":"+u+":"+t+"."+s+"Z"
else return y+"-"+x+"-"+w+" "+v+":"+u+":"+t+"."+s},
v:function(a,b){return P.e5(C.d.K(this.a,b.ged()),this.b)},
gdR:function(){return this.a},
b3:function(a,b){var z=Math.abs(this.a)
if(!(z>864e13)){z===864e13
z=!1}else z=!0
if(z)throw H.c(P.au(this.gdR()))},
l:{
e5:function(a,b){var z=new P.aV(a,b)
z.b3(a,b)
return z},
e6:function(a){var z,y
z=Math.abs(a)
y=a<0?"-":""
if(z>=1000)return""+a
if(z>=100)return y+"0"+H.a(z)
if(z>=10)return y+"00"+H.a(z)
return y+"000"+H.a(z)},
e7:function(a){if(a>=100)return""+a
if(a>=10)return"0"+a
return"00"+a},
av:function(a){if(a>=10)return""+a
return"0"+a}}},
a2:{"^":"aP;"},
"+double":0,
T:{"^":"b;a",
K:function(a,b){return new P.T(C.a.K(this.a,b.gbf()))},
W:function(a,b){return new P.T(C.a.W(this.a,b.gbf()))},
U:function(a,b){if(typeof b!=="number")return H.n(b)
return new P.T(C.d.aV(this.a*b))},
at:function(a,b){if(b===0)throw H.c(new P.eh())
return new P.T(C.a.at(this.a,b))},
a2:function(a,b){return C.a.a2(this.a,b.gbf())},
m:function(a,b){if(b==null)return!1
if(!(b instanceof P.T))return!1
return this.a===b.a},
gp:function(a){return this.a&0x1FFFFFFF},
i:function(a){var z,y,x,w,v
z=new P.ea()
y=this.a
if(y<0)return"-"+new P.T(-y).i(0)
x=z.$1(C.a.Z(y,6e7)%60)
w=z.$1(C.a.Z(y,1e6)%60)
v=new P.e9().$1(y%1e6)
return""+C.a.Z(y,36e8)+":"+H.a(x)+":"+H.a(w)+"."+H.a(v)}},
e9:{"^":"f:6;",
$1:function(a){if(a>=1e5)return""+a
if(a>=1e4)return"0"+a
if(a>=1000)return"00"+a
if(a>=100)return"000"+a
if(a>=10)return"0000"+a
return"00000"+a}},
ea:{"^":"f:6;",
$1:function(a){if(a>=10)return""+a
return"0"+a}},
u:{"^":"b;",
gV:function(){return H.B(this.$thrownJsError)}},
cn:{"^":"u;",
i:function(a){return"Throw of null."}},
a4:{"^":"u;a,b,c,d",
gaF:function(){return"Invalid argument"+(!this.a?"(s)":"")},
gaE:function(){return""},
i:function(a){var z,y,x,w,v,u
z=this.c
y=z!=null?" ("+H.a(z)+")":""
z=this.d
x=z==null?"":": "+H.a(z)
w=this.gaF()+y+x
if(!this.a)return w
v=this.gaE()
u=P.aw(this.b)
return w+v+": "+H.a(u)},
l:{
au:function(a){return new P.a4(!1,null,null,a)},
bZ:function(a,b,c){return new P.a4(!0,a,b,c)}}},
cv:{"^":"a4;e,f,a,b,c,d",
gaF:function(){return"RangeError"},
gaE:function(){var z,y,x
z=this.e
if(z==null){z=this.f
y=z!=null?": Not less than or equal to "+H.a(z):""}else{x=this.f
if(x==null)y=": Not greater than or equal to "+H.a(z)
else{if(typeof x!=="number")return x.ar()
if(typeof z!=="number")return H.n(z)
if(x>z)y=": Not in range "+z+".."+x+", inclusive"
else y=x<z?": Valid value range is empty":": Only valid value is "+z}}return y},
l:{
b3:function(a,b,c){return new P.cv(null,null,!0,a,b,"Value not in range")},
Z:function(a,b,c,d,e){return new P.cv(b,c,!0,a,d,"Invalid value")},
cw:function(a,b,c,d,e,f){if(0>a||a>c)throw H.c(P.Z(a,0,c,"start",f))
if(a>b||b>c)throw H.c(P.Z(b,a,c,"end",f))
return b}}},
eg:{"^":"a4;e,k:f>,a,b,c,d",
gaF:function(){return"RangeError"},
gaE:function(){if(J.dv(this.b,0))return": index must not be negative"
var z=this.f
if(z===0)return": no indices are valid"
return": index should be less than "+H.a(z)},
l:{
aY:function(a,b,c,d,e){var z=e!=null?e:J.at(b)
return new P.eg(b,z,!0,a,c,"Index out of range")}}},
eS:{"^":"u;a,b,c,d,e",
i:function(a){var z,y,x,w,v,u,t,s
z={}
y=new P.aI("")
z.a=""
for(x=this.c,w=x.length,v=0;v<w;++v){u=x[v]
y.j+=z.a
y.j+=H.a(P.aw(u))
z.a=", "}this.d.S(0,new P.eT(z,y))
t=P.aw(this.a)
s=y.i(0)
return"NoSuchMethodError: method not found: '"+H.a(this.b.a)+"'\nReceiver: "+H.a(t)+"\nArguments: ["+s+"]"},
l:{
cl:function(a,b,c,d,e){return new P.eS(a,b,c,d,e)}}},
q:{"^":"u;a",
i:function(a){return"Unsupported operation: "+this.a}},
cR:{"^":"u;a",
i:function(a){var z=this.a
return z!=null?"UnimplementedError: "+H.a(z):"UnimplementedError"}},
b6:{"^":"u;a",
i:function(a){return"Bad state: "+this.a}},
ah:{"^":"u;a",
i:function(a){var z=this.a
if(z==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+H.a(P.aw(z))+"."}},
cz:{"^":"b;",
i:function(a){return"Stack Overflow"},
gV:function(){return},
$isu:1},
e4:{"^":"u;a",
i:function(a){var z=this.a
return z==null?"Reading static variable during its initialization":"Reading static variable '"+H.a(z)+"' during its initialization"}},
fH:{"^":"b;a",
i:function(a){var z=this.a
if(z==null)return"Exception"
return"Exception: "+H.a(z)}},
ee:{"^":"b;a,b,c",
i:function(a){var z,y,x
z=this.a
y=z!=null&&""!==z?"FormatException: "+H.a(z):"FormatException"
x=this.b
if(typeof x!=="string")return y
if(x.length>78)x=J.dQ(x,0,75)+"..."
return y+"\n"+H.a(x)}},
eh:{"^":"b;",
i:function(a){return"IntegerDivisionByZeroException"}},
ec:{"^":"b;a,bm",
i:function(a){return"Expando:"+H.a(this.a)},
h:function(a,b){var z,y
z=this.bm
if(typeof z!=="string"){if(b==null||typeof b==="boolean"||typeof b==="number"||typeof b==="string")H.p(P.bZ(b,"Expandos are not allowed on strings, numbers, booleans or null",null))
return z.get(b)}y=H.bw(b,"expando$values")
return y==null?null:H.bw(y,z)},
n:function(a,b,c){var z,y
z=this.bm
if(typeof z!=="string")z.set(b,c)
else{y=H.bw(b,"expando$values")
if(y==null){y=new P.b()
H.cu(b,"expando$values",y)}H.cu(y,z,c)}}},
k:{"^":"aP;"},
"+int":0,
K:{"^":"b;$ti",
a1:function(a,b){return H.b_(this,b,H.x(this,"K",0),null)},
b_:function(a,b){return P.a7(this,!0,H.x(this,"K",0))},
aZ:function(a){return this.b_(a,!0)},
gk:function(a){var z,y
z=this.gA(this)
for(y=0;z.q();)++y
return y},
J:function(a,b){var z,y,x
if(b<0)H.p(P.Z(b,0,null,"index",null))
for(z=this.gA(this),y=0;z.q();){x=z.gt()
if(b===y)return x;++y}throw H.c(P.aY(b,this,"index",null,y))},
i:function(a){return P.et(this,"(",")")}},
ev:{"^":"b;"},
i:{"^":"b;$ti",$asi:null,$ish:1,$ash:null},
"+List":0,
eU:{"^":"b;",
gp:function(a){return P.b.prototype.gp.call(this,this)},
i:function(a){return"null"}},
"+Null":0,
aP:{"^":"b;"},
"+num":0,
b:{"^":";",
m:function(a,b){return this===b},
gp:function(a){return H.Y(this)},
i:["cz",function(a){return H.b2(this)}],
aS:function(a,b){throw H.c(P.cl(this,b.gbR(),b.gbW(),b.gbS(),null))},
toString:function(){return this.i(this)}},
aH:{"^":"b;"},
H:{"^":"b;"},
"+String":0,
aI:{"^":"b;j@",
gk:function(a){return this.j.length},
i:function(a){var z=this.j
return z.charCodeAt(0)==0?z:z},
l:{
cA:function(a,b,c){var z=J.aR(b)
if(!z.q())return a
if(c.length===0){do a+=H.a(z.gt())
while(z.q())}else{a+=H.a(z.gt())
for(;z.q();)a=a+c+H.a(z.gt())}return a}}},
aJ:{"^":"b;"}}],["","",,W,{"^":"",
a0:function(a,b){a=536870911&a+b
a=536870911&a+((524287&a)<<10)
return a^a>>>6},
cY:function(a){a=536870911&a+((67108863&a)<<3)
a^=a>>>11
return 536870911&a+((16383&a)<<15)},
hy:function(a){var z=$.l
if(z===C.b)return a
return z.bF(a,!0)},
P:{"^":"c5;","%":"HTMLAppletElement|HTMLBRElement|HTMLBaseElement|HTMLButtonElement|HTMLContentElement|HTMLDListElement|HTMLDataListElement|HTMLDetailsElement|HTMLDialogElement|HTMLDirectoryElement|HTMLDivElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFontElement|HTMLFrameElement|HTMLHRElement|HTMLHeadElement|HTMLHeadingElement|HTMLHtmlElement|HTMLIFrameElement|HTMLImageElement|HTMLKeygenElement|HTMLLIElement|HTMLLabelElement|HTMLLegendElement|HTMLLinkElement|HTMLMapElement|HTMLMarqueeElement|HTMLMenuElement|HTMLMenuItemElement|HTMLMetaElement|HTMLMeterElement|HTMLModElement|HTMLOListElement|HTMLObjectElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLParamElement|HTMLPictureElement|HTMLPreElement|HTMLProgressElement|HTMLQuoteElement|HTMLScriptElement|HTMLShadowElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableCaptionElement|HTMLTableCellElement|HTMLTableColElement|HTMLTableDataCellElement|HTMLTableElement|HTMLTableHeaderCellElement|HTMLTableRowElement|HTMLTableSectionElement|HTMLTemplateElement|HTMLTextAreaElement|HTMLTitleElement|HTMLTrackElement|HTMLUListElement|HTMLUnknownElement|PluginPlaceholderElement;HTMLElement"},
ic:{"^":"P;",
i:function(a){return String(a)},
$isd:1,
"%":"HTMLAnchorElement"},
ie:{"^":"P;",
i:function(a){return String(a)},
$isd:1,
"%":"HTMLAreaElement"},
bk:{"^":"d;",$isbk:1,"%":"Blob|File"},
ig:{"^":"P;",$isd:1,"%":"HTMLBodyElement"},
ih:{"^":"P;",
ca:function(a,b,c){return a.getContext(b)},
c9:function(a,b){return this.ca(a,b,null)},
"%":"HTMLCanvasElement"},
ii:{"^":"d;ab:fillStyle}",
a7:function(a){return a.beginPath()},
cb:function(a,b,c,d,e){return P.hJ(a.getImageData(b,c,d,e))},
dX:function(a){return a.restore()},
ce:function(a){return a.save()},
cf:function(a,b,c){return a.scale(b,c)},
e3:function(a,b,c){return a.translate(b,c)},
dc:function(a){return a.closePath()},
dS:function(a,b,c){return a.moveTo(b,c)},
a6:function(a,b,c,d,e,f,g){a.arc(b,c,d,e,f,!0)},
ds:function(a,b,c,d){return a.drawImage(b,c,d)},
dw:function(a,b){a.fill(b)},
aa:function(a){return this.dw(a,"nonzero")},
"%":"CanvasRenderingContext2D"},
ij:{"^":"v;k:length=",$isd:1,"%":"CDATASection|CharacterData|Comment|ProcessingInstruction|Text"},
ik:{"^":"ei;k:length=","%":"CSS2Properties|CSSStyleDeclaration|MSStyleCSSProperties"},
ei:{"^":"d+e3;"},
e3:{"^":"b;"},
il:{"^":"v;",$isd:1,"%":"DocumentFragment|ShadowRoot"},
im:{"^":"d;",
i:function(a){return String(a)},
"%":"DOMException"},
e8:{"^":"d;",
i:function(a){return"Rectangle ("+H.a(a.left)+", "+H.a(a.top)+") "+H.a(this.gE(a))+" x "+H.a(this.gC(a))},
m:function(a,b){var z
if(b==null)return!1
z=J.j(b)
if(!z.$isaG)return!1
return a.left===z.gaR(b)&&a.top===z.gb0(b)&&this.gE(a)===z.gE(b)&&this.gC(a)===z.gC(b)},
gp:function(a){var z,y,x,w
z=a.left
y=a.top
x=this.gE(a)
w=this.gC(a)
return W.cY(W.a0(W.a0(W.a0(W.a0(0,z&0x1FFFFFFF),y&0x1FFFFFFF),x&0x1FFFFFFF),w&0x1FFFFFFF))},
gC:function(a){return a.height},
gaR:function(a){return a.left},
gb0:function(a){return a.top},
gE:function(a){return a.width},
$isaG:1,
$asaG:I.t,
"%":";DOMRectReadOnly"},
c5:{"^":"v;",
i:function(a){return a.localName},
gbT:function(a){return new W.ba(a,"pause",!1,[W.O])},
gbU:function(a){return new W.ba(a,"play",!1,[W.O])},
$isd:1,
"%":";Element"},
io:{"^":"O;R:error=","%":"ErrorEvent"},
O:{"^":"d;",$isO:1,"%":"AnimationEvent|AnimationPlayerEvent|ApplicationCacheErrorEvent|AudioProcessingEvent|AutocompleteErrorEvent|BeforeInstallPromptEvent|BeforeUnloadEvent|ClipboardEvent|CloseEvent|CompositionEvent|CrossOriginConnectEvent|CustomEvent|DefaultSessionStartEvent|DeviceLightEvent|DeviceMotionEvent|DeviceOrientationEvent|DragEvent|ExtendableEvent|FetchEvent|FocusEvent|FontFaceSetLoadEvent|GamepadEvent|GeofencingEvent|HashChangeEvent|IDBVersionChangeEvent|KeyboardEvent|MIDIConnectionEvent|MIDIMessageEvent|MediaEncryptedEvent|MediaKeyEvent|MediaKeyMessageEvent|MediaQueryListEvent|MediaStreamEvent|MediaStreamTrackEvent|MessageEvent|MouseEvent|NotificationEvent|OfflineAudioCompletionEvent|PageTransitionEvent|PeriodicSyncEvent|PointerEvent|PopStateEvent|ProgressEvent|PromiseRejectionEvent|PushEvent|RTCDTMFToneChangeEvent|RTCDataChannelEvent|RTCIceCandidateEvent|RTCPeerConnectionIceEvent|RelatedEvent|ResourceProgressEvent|SVGZoomEvent|SecurityPolicyViolationEvent|ServicePortConnectEvent|ServiceWorkerMessageEvent|SpeechRecognitionEvent|SpeechSynthesisEvent|StorageEvent|SyncEvent|TextEvent|TouchEvent|TrackEvent|TransitionEvent|UIEvent|WebGLContextEvent|WebKitTransitionEvent|WheelEvent|XMLHttpRequestProgressEvent;Event|InputEvent"},
c6:{"^":"d;",
cM:function(a,b,c,d){return a.addEventListener(b,H.ad(c,1),!1)},
d3:function(a,b,c,d){return a.removeEventListener(b,H.ad(c,1),!1)},
"%":"CrossOriginServiceWorkerClient|MediaStream;EventTarget"},
iG:{"^":"P;k:length=","%":"HTMLFormElement"},
ay:{"^":"d;aO:data=,C:height=,E:width=",$isay:1,"%":"ImageData"},
iI:{"^":"P;",$isd:1,$isv:1,"%":"HTMLInputElement"},
eR:{"^":"P;da:autoplay},R:error=","%":"HTMLAudioElement;HTMLMediaElement"},
iX:{"^":"d;",$isd:1,"%":"Navigator"},
v:{"^":"c6;",
i:function(a){var z=a.nodeValue
return z==null?this.cu(a):z},
$isv:1,
$isb:1,
"%":"Attr|Document|HTMLDocument|XMLDocument;Node"},
j_:{"^":"P;k:length=","%":"HTMLSelectElement"},
j0:{"^":"O;R:error=","%":"SpeechRecognitionError"},
j5:{"^":"eR;e4:videoHeight=,e5:videoWidth=","%":"HTMLVideoElement"},
bz:{"^":"c6;",$isbz:1,$isd:1,"%":"DOMWindow|Window"},
jb:{"^":"d;C:height=,aR:left=,b0:top=,E:width=",
i:function(a){return"Rectangle ("+H.a(a.left)+", "+H.a(a.top)+") "+H.a(a.width)+" x "+H.a(a.height)},
m:function(a,b){var z,y,x
if(b==null)return!1
z=J.j(b)
if(!z.$isaG)return!1
y=a.left
x=z.gaR(b)
if(y==null?x==null:y===x){y=a.top
x=z.gb0(b)
if(y==null?x==null:y===x){y=a.width
x=z.gE(b)
if(y==null?x==null:y===x){y=a.height
z=z.gC(b)
z=y==null?z==null:y===z}else z=!1}else z=!1}else z=!1
return z},
gp:function(a){var z,y,x,w
z=J.N(a.left)
y=J.N(a.top)
x=J.N(a.width)
w=J.N(a.height)
return W.cY(W.a0(W.a0(W.a0(W.a0(0,z),y),x),w))},
$isaG:1,
$asaG:I.t,
"%":"ClientRect"},
jc:{"^":"v;",$isd:1,"%":"DocumentType"},
jd:{"^":"e8;",
gC:function(a){return a.height},
gE:function(a){return a.width},
"%":"DOMRect"},
jg:{"^":"P;",$isd:1,"%":"HTMLFrameSetElement"},
jh:{"^":"ek;",
gk:function(a){return a.length},
h:function(a,b){if(b>>>0!==b||b>=a.length)throw H.c(P.aY(b,a,null,null,null))
return a[b]},
n:function(a,b,c){throw H.c(new P.q("Cannot assign element of immutable List."))},
sk:function(a,b){throw H.c(new P.q("Cannot resize immutable List."))},
J:function(a,b){if(b<0||b>=a.length)return H.e(a,b)
return a[b]},
$isi:1,
$asi:function(){return[W.v]},
$ish:1,
$ash:function(){return[W.v]},
$isL:1,
$asL:function(){return[W.v]},
$isD:1,
$asD:function(){return[W.v]},
"%":"MozNamedAttrMap|NamedNodeMap"},
ej:{"^":"d+aF;",
$asi:function(){return[W.v]},
$ash:function(){return[W.v]},
$isi:1,
$ish:1},
ek:{"^":"ej+ef;",
$asi:function(){return[W.v]},
$ash:function(){return[W.v]},
$isi:1,
$ish:1},
fE:{"^":"a_;$ti",
ae:function(a,b,c,d){return W.bC(this.a,this.b,a,!1,H.ae(this,0))},
bP:function(a,b,c){return this.ae(a,null,b,c)}},
ba:{"^":"fE;a,b,c,$ti"},
fF:{"^":"f8;a,b,c,d,e,$ti",
al:function(){if(this.b==null)return
this.bC()
this.b=null
this.d=null
return},
aT:function(a,b){if(this.b==null)return;++this.a
this.bC()},
bV:function(a){return this.aT(a,null)},
gaP:function(){return this.a>0},
bZ:function(){if(this.b==null||this.a<=0)return;--this.a
this.bA()},
bA:function(){var z,y,x
z=this.d
y=z!=null
if(y&&this.a<=0){x=this.b
x.toString
if(y)J.dA(x,this.c,z,!1)}},
bC:function(){var z,y,x
z=this.d
y=z!=null
if(y){x=this.b
x.toString
if(y)J.dB(x,this.c,z,!1)}},
cI:function(a,b,c,d,e){this.bA()},
l:{
bC:function(a,b,c,d,e){var z=c==null?null:W.hy(new W.fG(c))
z=new W.fF(0,a,b,z,!1,[e])
z.cI(a,b,c,!1,e)
return z}}},
fG:{"^":"f:1;a",
$1:[function(a){return this.a.$1(a)},null,null,2,0,null,5,"call"]},
ef:{"^":"b;$ti",
gA:function(a){return new W.ed(a,a.length,-1,null)},
v:function(a,b){throw H.c(new P.q("Cannot add to immutable List."))},
$isi:1,
$asi:null,
$ish:1,
$ash:null},
ed:{"^":"b;a,b,c,d",
q:function(){var z,y
z=this.c+1
y=this.b
if(z<y){y=this.a
if(z<0||z>=y.length)return H.e(y,z)
this.d=y[z]
this.c=z
return!0}this.d=null
this.c=y
return!1},
gt:function(){return this.d}}}],["","",,P,{"^":"",
hJ:function(a){var z,y
z=J.j(a)
if(!!z.$isay){y=z.gaO(a)
if(y.constructor===Array)if(typeof CanvasPixelArray!=="undefined"){y.constructor=CanvasPixelArray
y.BYTES_PER_ELEMENT=1}return a}return new P.hh(a.data,a.height,a.width)},
hh:{"^":"b;aO:a>,C:b>,E:c>",$isay:1,$isd:1}}],["","",,P,{"^":"",bs:{"^":"d;",$isbs:1,"%":"IDBKeyRange"}}],["","",,P,{"^":"",
hk:[function(a,b,c,d){var z,y
if(b===!0){z=[c]
C.c.bD(z,d)
d=z}y=P.a7(J.bX(d,P.i0()),!0,null)
return P.d3(H.eX(a,y))},null,null,8,0,null,20,21,22,23],
bG:function(a,b,c){var z
try{if(Object.isExtensible(a)&&!Object.prototype.hasOwnProperty.call(a,b)){Object.defineProperty(a,b,{value:c})
return!0}}catch(z){H.z(z)}return!1},
d5:function(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]
return},
d3:[function(a){var z
if(a==null||typeof a==="string"||typeof a==="number"||typeof a==="boolean")return a
z=J.j(a)
if(!!z.$isaD)return a.a
if(!!z.$isbk||!!z.$isO||!!z.$isbs||!!z.$isay||!!z.$isv||!!z.$isE||!!z.$isbz)return a
if(!!z.$isaV)return H.y(a)
if(!!z.$isbn)return P.d4(a,"$dart_jsFunction",new P.hm())
return P.d4(a,"_$dart_jsObject",new P.hn($.$get$bF()))},"$1","i1",2,0,1,9],
d4:function(a,b,c){var z=P.d5(a,b)
if(z==null){z=c.$1(a)
P.bG(a,b,z)}return z},
d2:[function(a){var z,y
if(a==null||typeof a=="string"||typeof a=="number"||typeof a=="boolean")return a
else{if(a instanceof Object){z=J.j(a)
z=!!z.$isbk||!!z.$isO||!!z.$isbs||!!z.$isay||!!z.$isv||!!z.$isE||!!z.$isbz}else z=!1
if(z)return a
else if(a instanceof Date){y=a.getTime()
z=new P.aV(y,!1)
z.b3(y,!1)
return z}else if(a.constructor===$.$get$bF())return a.o
else return P.db(a)}},"$1","i0",2,0,16,9],
db:function(a){if(typeof a=="function")return P.bH(a,$.$get$aU(),new P.hv())
if(a instanceof Array)return P.bH(a,$.$get$bB(),new P.hw())
return P.bH(a,$.$get$bB(),new P.hx())},
bH:function(a,b,c){var z=P.d5(a,b)
if(z==null||!(a instanceof Object)){z=c.$1(a)
P.bG(a,b,z)}return z},
aD:{"^":"b;a",
h:["cw",function(a,b){if(typeof b!=="string"&&typeof b!=="number")throw H.c(P.au("property is not a String or num"))
return P.d2(this.a[b])}],
n:["b2",function(a,b,c){if(typeof b!=="string"&&typeof b!=="number")throw H.c(P.au("property is not a String or num"))
this.a[b]=P.d3(c)}],
gp:function(a){return 0},
m:function(a,b){if(b==null)return!1
return b instanceof P.aD&&this.a===b.a},
i:function(a){var z,y
try{z=String(this.a)
return z}catch(y){H.z(y)
return this.cz(this)}},
bG:function(a,b){var z,y
z=this.a
y=b==null?null:P.a7(new H.b0(b,P.i1(),[null,null]),!0,null)
return P.d2(z[a].apply(z,y))}},
eC:{"^":"aD;a"},
eB:{"^":"eF;a,$ti",
h:function(a,b){var z
if(typeof b==="number"&&b===C.a.ap(b)){if(typeof b==="number"&&Math.floor(b)===b)z=b<0||b>=this.gk(this)
else z=!1
if(z)H.p(P.Z(b,0,this.gk(this),null,null))}return this.cw(0,b)},
n:function(a,b,c){var z
if(typeof b==="number"&&b===C.d.ap(b)){if(typeof b==="number"&&Math.floor(b)===b)z=b<0||b>=this.gk(this)
else z=!1
if(z)H.p(P.Z(b,0,this.gk(this),null,null))}this.b2(0,b,c)},
gk:function(a){var z=this.a.length
if(typeof z==="number"&&z>>>0===z)return z
throw H.c(new P.b6("Bad JsArray length"))},
sk:function(a,b){this.b2(0,"length",b)},
v:function(a,b){this.bG("push",[b])}},
eF:{"^":"aD+aF;",$asi:null,$ash:null,$isi:1,$ish:1},
hm:{"^":"f:1;",
$1:function(a){var z=function(b,c,d){return function(){return b(c,d,this,Array.prototype.slice.apply(arguments))}}(P.hk,a,!1)
P.bG(z,$.$get$aU(),a)
return z}},
hn:{"^":"f:1;a",
$1:function(a){return new this.a(a)}},
hv:{"^":"f:1;",
$1:function(a){return new P.eC(a)}},
hw:{"^":"f:1;",
$1:function(a){return new P.eB(a,[null])}},
hx:{"^":"f:1;",
$1:function(a){return new P.aD(a)}}}],["","",,P,{"^":"",ib:{"^":"ax;",$isd:1,"%":"SVGAElement"},id:{"^":"m;",$isd:1,"%":"SVGAnimateElement|SVGAnimateMotionElement|SVGAnimateTransformElement|SVGAnimationElement|SVGSetElement"},ip:{"^":"m;u:result=",$isd:1,"%":"SVGFEBlendElement"},iq:{"^":"m;u:result=",$isd:1,"%":"SVGFEColorMatrixElement"},ir:{"^":"m;u:result=",$isd:1,"%":"SVGFEComponentTransferElement"},is:{"^":"m;u:result=",$isd:1,"%":"SVGFECompositeElement"},it:{"^":"m;u:result=",$isd:1,"%":"SVGFEConvolveMatrixElement"},iu:{"^":"m;u:result=",$isd:1,"%":"SVGFEDiffuseLightingElement"},iv:{"^":"m;u:result=",$isd:1,"%":"SVGFEDisplacementMapElement"},iw:{"^":"m;u:result=",$isd:1,"%":"SVGFEFloodElement"},ix:{"^":"m;u:result=",$isd:1,"%":"SVGFEGaussianBlurElement"},iy:{"^":"m;u:result=",$isd:1,"%":"SVGFEImageElement"},iz:{"^":"m;u:result=",$isd:1,"%":"SVGFEMergeElement"},iA:{"^":"m;u:result=",$isd:1,"%":"SVGFEMorphologyElement"},iB:{"^":"m;u:result=",$isd:1,"%":"SVGFEOffsetElement"},iC:{"^":"m;u:result=",$isd:1,"%":"SVGFESpecularLightingElement"},iD:{"^":"m;u:result=",$isd:1,"%":"SVGFETileElement"},iE:{"^":"m;u:result=",$isd:1,"%":"SVGFETurbulenceElement"},iF:{"^":"m;",$isd:1,"%":"SVGFilterElement"},ax:{"^":"m;",$isd:1,"%":"SVGCircleElement|SVGClipPathElement|SVGDefsElement|SVGEllipseElement|SVGForeignObjectElement|SVGGElement|SVGGeometryElement|SVGLineElement|SVGPathElement|SVGPolygonElement|SVGPolylineElement|SVGRectElement|SVGSwitchElement;SVGGraphicsElement"},iH:{"^":"ax;",$isd:1,"%":"SVGImageElement"},iL:{"^":"m;",$isd:1,"%":"SVGMarkerElement"},iM:{"^":"m;",$isd:1,"%":"SVGMaskElement"},iY:{"^":"m;",$isd:1,"%":"SVGPatternElement"},iZ:{"^":"m;",$isd:1,"%":"SVGScriptElement"},m:{"^":"c5;",
gbT:function(a){return new W.ba(a,"pause",!1,[W.O])},
gbU:function(a){return new W.ba(a,"play",!1,[W.O])},
$isd:1,
"%":"SVGComponentTransferFunctionElement|SVGDescElement|SVGDiscardElement|SVGFEDistantLightElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEMergeNodeElement|SVGFEPointLightElement|SVGFESpotLightElement|SVGMetadataElement|SVGStopElement|SVGStyleElement|SVGTitleElement;SVGElement"},j1:{"^":"ax;",$isd:1,"%":"SVGSVGElement"},j2:{"^":"m;",$isd:1,"%":"SVGSymbolElement"},fd:{"^":"ax;","%":"SVGTSpanElement|SVGTextElement|SVGTextPositioningElement;SVGTextContentElement"},j3:{"^":"fd;",$isd:1,"%":"SVGTextPathElement"},j4:{"^":"ax;",$isd:1,"%":"SVGUseElement"},j6:{"^":"m;",$isd:1,"%":"SVGViewElement"},jf:{"^":"m;",$isd:1,"%":"SVGGradientElement|SVGLinearGradientElement|SVGRadialGradientElement"},ji:{"^":"m;",$isd:1,"%":"SVGCursorElement"},jj:{"^":"m;",$isd:1,"%":"SVGFEDropShadowElement"},jk:{"^":"m;",$isd:1,"%":"SVGMPathElement"}}],["","",,P,{"^":""}],["","",,P,{"^":""}],["","",,P,{"^":""}],["","",,X,{"^":"",
jr:[function(a){X.fo(a)},"$1","i3",2,0,17,24],
js:[function(){J.dz($.$get$bL(),"topcodes_initVideoScanner",X.i3())},"$0","dm",0,0,2],
f4:{"^":"b;a,b,c",
cg:function(a,b){var z,y,x,w,v,u,t,s
this.a=a
this.b=J.dI(a)
this.c=J.dF(this.a)
z=this.e1()
y=H.G([],[X.cF])
for(x=z.length,w=0;w<z.length;z.length===x||(0,H.aQ)(z),++w){v=z[w]
if(!this.dT(y,v.a,v.b)){u=new X.cF(-1,9,0,0,0,[0,0,0,0,0,0,0,0])
u.dg(this,v.a,v.b)
if(u.a>0){t=u.d
s=u.b*8/2
if(t>s){s=J.ar(this.b,s)
if(typeof s!=="number")return H.n(s)
if(t<s){t=u.e
s=u.b*8/2
if(t>s){s=J.ar(this.c,s)
if(typeof s!=="number")return H.n(s)
s=t<s
t=s}else t=!1}else t=!1}else t=!1
if(t)y.push(u)}}}return y},
dT:function(a,b,c){var z,y,x,w
for(z=a.length,y=J.I(b),x=J.I(c),w=0;w<a.length;a.length===z||(0,H.aQ)(a),++w)if(a[w].de(0,y.aY(b),x.aY(c)))return!0
return!1},
e1:function(){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h
z=H.G([],[X.c1])
y=null
x=null
w=null
v=null
u=null
t=128
s=null
r=0
while(!0){q=this.c
if(typeof q!=="number")return H.n(q)
if(!(r<q))break
q=r%2===0
p=q?0:J.ar(this.b,1)
o=this.b
if(typeof o!=="number")return H.n(o)
p=J.Q(p,r*o)
n=0
m=0
l=0
k=0
j=0
while(!0){o=this.b
if(typeof o!=="number")return H.n(o)
if(!(j<o))break
o=J.S(this.a)
i=J.bN(p)
h=i.U(p,4)
if(h>>>0!==h||h>=o.length)return H.e(o,h)
y=o[h]
h=J.S(this.a)
o=J.Q(i.U(p,4),1)
if(o>>>0!==o||o>=h.length)return H.e(h,o)
x=h[o]
o=J.S(this.a)
h=J.Q(i.U(p,4),2)
if(h>>>0!==h||h>=o.length)return H.e(o,h)
w=o[h]
v=y+x+w
t+=v-C.a.N(t,3)
u=C.a.N(t,3)
y&=254
v=v<u*0.975?0:1
o=J.S(this.a)
h=i.U(p,4)
if(h>>>0!==h||h>=o.length)return H.e(o,h)
o[h]=y+v
switch(k){case 0:if(v===0){n=1
m=0
l=0
k=1}break
case 1:if(v===0)++n
else{m=1
k=2}break
case 2:if(v===0){l=1
k=3}else ++m
break
case 3:if(v===0)++l
else{if(n>=4)if(l>=4)if(m>=6){o=n+l
h=o-m
o=h<=o&&h<=m&&l-n<=n&&n-l<=l}else o=!1
else o=!1
else o=!1
if(o){s=1+l+(m>>>1)
s=q?i.W(p,s):i.K(p,s)
z.push(new X.c1(J.dw(s,this.b),r))}n=l
m=1
l=0
k=2}break}p=i.K(p,q?1:-1);++j}++r}return z},
cc:function(a,b){var z,y,x,w,v,u,t,s,r
if(a>=1){z=J.ar(this.b,2)
if(typeof z!=="number")return H.n(z)
if(!(a>z))if(b>=1){z=J.ar(this.c,2)
if(typeof z!=="number")return H.n(z)
z=b>z}else z=!0
else z=!0}else z=!0
if(z)return 0
for(y=b-1,z=b+1,x=a-1,w=a+1,v=0,u=null;y<=z;++y)for(t=x;t<=w;++t){s=J.S(this.a)
r=this.b
if(typeof r!=="number")return H.n(r)
r=(y*r+t)*4
if(r>>>0!==r||r>=s.length)return H.e(s,r)
u=s[r]
v+=(u&1)*255}return C.a.Z(v,9)},
an:function(a,b,c,d){var z,y,x,w,v,u
z=J.dx(b,this.b)
if(typeof a!=="number")return H.n(a)
y=z+a
z=J.S(this.a)
x=y*4
if(x>>>0!==x||x>=z.length)return H.e(z,x)
w=z[x]&1
for(v=0,u=!1;!0;){z=this.b
if(typeof z!=="number")return H.n(z)
y+=c+d*z;++v
if(!(y<=0)){x=this.c
if(typeof x!=="number")return H.n(x)
x=y>=z*x
z=x}else z=!0
if(z)return v
else{z=J.S(this.a)
x=y*4
if(x>>>0!==x||x>=z.length)return H.e(z,x)
if((z[x]&1)!==w){if(u)return v
else{z=J.S(this.a)
if(x>=z.length)return H.e(z,x)
w=z[x]&1}u=!0}}}}},
c1:{"^":"b;a,b"},
cF:{"^":"b;a,b,c,d,e,f",
e2:function(){return P.V(["code",this.a,"x",this.d,"y",this.e,"radius",this.b*8/2,"angle",this.c])},
de:function(a,b,c){var z,y,x
z=this.d-b
y=this.e-c
x=this.b*4
return z*z+y*y<=x*x},
dg:function(a,b,c){var z,y,x,w,v,u,t,s,r,q,p
z=a.an(b,c,0,-1)
y=a.an(b,c,0,1)
x=a.an(b,c,-1,0)
w=a.an(b,c,1,0)
this.d=J.bY(b)
v=J.bY(c)
this.e=v
u=this.d
if(typeof w!=="number")return w.W()
if(typeof x!=="number")return H.n(x)
this.d=u+(w-x)/2
if(typeof y!=="number")return y.W()
if(typeof z!=="number")return H.n(z)
this.e=v+(y-z)/2
this.b=(w+x+z+y)/8
this.a=-1
for(t=0,s=0,r=0;r<5;++r){q=r*0.483321946706122/5
p=this.bX(a,this.b,q)
if(p>t){s=q
t=p}}if(t>0){this.bX(a,this.b,s)
this.a=this.dY(this.a,s)}return this.a},
bX:function(a,b,c){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h
this.a=-1
for(z=this.f,y=null,x=0,w=null,v=null,u=0,t=0,s=0;s<13;++s){r=0.483321946706122*s+c
q=Math.cos(r)
p=Math.sin(r)
for(o=0;o<8;++o){y=(o-3.5)*b
w=C.a.ap(C.d.aV(this.d+q*y))
v=C.a.ap(C.d.aV(this.e+p*y))
z[o]=a.cc(w,v)}r=z[1]
if(r<=128||z[3]<=128||z[4]<=128||z[6]<=128)return 0
n=z[2]
if(n>128||z[5]>128)return 0
m=z[3]
l=z[4]
k=z[6]
j=z[5]
i=z[7]
x=x+(r+m+l+k+(255-n)+(255-j))+Math.abs(i*2-255)
h=i>128?1:0
t+=h
u=(u<<1>>>0)+h}if(t===5){this.a=u
return x}else return 0},
dY:function(a,b){var z,y
this.c=0
for(z=a,y=1;y<=13;++y){a=(a<<1&8191|C.a.N(a,12))>>>0
if(a<z){this.c=y*0.483321946706122
z=a}}this.c+=b-0.241660973353061
return z},
dr:function(a,b){var z,y,x,w,v,u,t
z=this.a
y=this.b*b
x=8*y*0.5
w=this.c
v=J.o(a)
v.sab(a,"white")
v.a7(a)
v.a6(a,this.d,this.e,x,0,6.283185307179586,!0)
v.aa(a)
for(u=0;u<13;++u){t=u*-0.483321946706122+w
v.sab(a,(z&1)>0?"white":"black")
v.a7(a)
v.dS(a,this.d,this.e)
v.a6(a,this.d,this.e,x,t,t-0.483321946706122,!0)
v.dc(a)
v.aa(a)
z=C.a.N(z,1)}v.sab(a,"white")
v.a7(a)
v.a6(a,this.d,this.e,x-y,0,6.283185307179586,!0)
v.aa(a)
v.sab(a,"black")
v.a7(a)
v.a6(a,this.d,this.e,x-y*2,0,6.283185307179586,!0)
v.aa(a)
v.sab(a,"white")
v.a7(a)
v.a6(a,this.d,this.e,x-y*3,0,6.283185307179586,!0)
v.aa(a)},
dq:function(a){return this.dr(a,1)}},
fn:{"^":"b;a,b,c,d,e,f,r",
ec:[function(a){var z,y,x,w,v,u,t
J.dN(this.b)
J.dR(this.b,J.bj(this.c),0)
J.dO(this.b,-1,1)
J.dD(this.b,this.c,0,0)
J.dM(this.b)
z=J.dK(this.b,0,0,J.bj(this.c),J.bW(this.c))
y=this.e.cg(z,this.b)
x=this.a
w=P.V(["canvasId",x,"topcodes",[]])
for(v=y.length,u=0;u<y.length;y.length===v||(0,H.aQ)(y),++u){t=y[u]
t.dq(this.b)
J.dC(w.h(0,"topcodes"),t.e2())}J.bU($.$get$bL(),"TopCodes").bG("_relayFrameData",[x,C.z.dt(w)])},"$1","gd4",2,0,14],
cG:function(a){var z,y,x,w
this.e=new X.f4(null,null,null)
z=this.a
y="#"+H.a(z)
x=document
w=x.querySelector(y)
this.b=J.dJ(w,"2d")
y=x.createElement("video")
y.id=H.a(z)+"-video"
this.c=y
J.dP(y,!0)
y=this.c
z=y.style
z.display="none"
x.body.appendChild(y)
this.f=H.ct(w.getAttribute("width"),null,null)
this.r=H.ct(w.getAttribute("height"),null,null)
z=J.dH(this.c)
W.bC(z.a,z.b,new X.fp(this),!1,H.ae(z,0))
z=J.dG(this.c)
W.bC(z.a,z.b,new X.fq(this),!1,H.ae(z,0))},
l:{
fo:function(a){var z=new X.fn(a,null,null,null,null,null,null)
z.cG(a)
return z}}},
fp:{"^":"f:1;a",
$1:function(a){var z=this.a
P.aq("video width: "+H.a(J.bj(z.c)))
P.aq("video height: "+H.a(J.bW(z.c)))
z.d=P.fk(C.p,z.gd4())}},
fq:{"^":"f:1;a",
$1:function(a){var z,y
P.aq("pause")
z=this.a
y=z.d
if(y!=null)y.al()
z.d=null}}},1]]
setupProgram(dart,0)
J.j=function(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cc.prototype
return J.ex.prototype}if(typeof a=="string")return J.aB.prototype
if(a==null)return J.ez.prototype
if(typeof a=="boolean")return J.ew.prototype
if(a.constructor==Array)return J.az.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aC.prototype
return a}if(a instanceof P.b)return a
return J.be(a)}
J.F=function(a){if(typeof a=="string")return J.aB.prototype
if(a==null)return a
if(a.constructor==Array)return J.az.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aC.prototype
return a}if(a instanceof P.b)return a
return J.be(a)}
J.aO=function(a){if(a==null)return a
if(a.constructor==Array)return J.az.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aC.prototype
return a}if(a instanceof P.b)return a
return J.be(a)}
J.I=function(a){if(typeof a=="number")return J.aA.prototype
if(a==null)return a
if(!(a instanceof P.b))return J.aK.prototype
return a}
J.bN=function(a){if(typeof a=="number")return J.aA.prototype
if(typeof a=="string")return J.aB.prototype
if(a==null)return a
if(!(a instanceof P.b))return J.aK.prototype
return a}
J.hN=function(a){if(typeof a=="string")return J.aB.prototype
if(a==null)return a
if(!(a instanceof P.b))return J.aK.prototype
return a}
J.o=function(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.aC.prototype
return a}if(a instanceof P.b)return a
return J.be(a)}
J.Q=function(a,b){if(typeof a=="number"&&typeof b=="number")return a+b
return J.bN(a).K(a,b)}
J.R=function(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.j(a).m(a,b)}
J.du=function(a,b){if(typeof a=="number"&&typeof b=="number")return a>b
return J.I(a).ar(a,b)}
J.dv=function(a,b){if(typeof a=="number"&&typeof b=="number")return a<b
return J.I(a).a2(a,b)}
J.dw=function(a,b){return J.I(a).cd(a,b)}
J.dx=function(a,b){if(typeof a=="number"&&typeof b=="number")return a*b
return J.bN(a).U(a,b)}
J.bT=function(a,b){return J.I(a).cq(a,b)}
J.ar=function(a,b){if(typeof a=="number"&&typeof b=="number")return a-b
return J.I(a).W(a,b)}
J.dy=function(a,b){if(typeof a=="number"&&typeof b=="number")return(a^b)>>>0
return J.I(a).cC(a,b)}
J.bU=function(a,b){if(typeof b==="number")if(a.constructor==Array||typeof a=="string"||H.dj(a,a[init.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.F(a).h(a,b)}
J.dz=function(a,b,c){if(typeof b==="number")if((a.constructor==Array||H.dj(a,a[init.dispatchPropertyName]))&&!a.immutable$list&&b>>>0===b&&b<a.length)return a[b]=c
return J.aO(a).n(a,b,c)}
J.dA=function(a,b,c,d){return J.o(a).cM(a,b,c,d)}
J.dB=function(a,b,c,d){return J.o(a).d3(a,b,c,d)}
J.dC=function(a,b){return J.aO(a).v(a,b)}
J.dD=function(a,b,c,d){return J.o(a).ds(a,b,c,d)}
J.dE=function(a,b){return J.aO(a).J(a,b)}
J.S=function(a){return J.o(a).gaO(a)}
J.as=function(a){return J.o(a).gR(a)}
J.N=function(a){return J.j(a).gp(a)}
J.dF=function(a){return J.o(a).gC(a)}
J.aR=function(a){return J.aO(a).gA(a)}
J.at=function(a){return J.F(a).gk(a)}
J.dG=function(a){return J.o(a).gbT(a)}
J.dH=function(a){return J.o(a).gbU(a)}
J.bV=function(a){return J.o(a).gu(a)}
J.bW=function(a){return J.o(a).ge4(a)}
J.bj=function(a){return J.o(a).ge5(a)}
J.dI=function(a){return J.o(a).gE(a)}
J.dJ=function(a,b){return J.o(a).c9(a,b)}
J.dK=function(a,b,c,d,e){return J.o(a).cb(a,b,c,d,e)}
J.bX=function(a,b){return J.aO(a).a1(a,b)}
J.dL=function(a,b){return J.j(a).aS(a,b)}
J.dM=function(a){return J.o(a).dX(a)}
J.dN=function(a){return J.o(a).ce(a)}
J.dO=function(a,b,c){return J.o(a).cf(a,b,c)}
J.dP=function(a,b){return J.o(a).sda(a,b)}
J.dQ=function(a,b,c){return J.hN(a).a3(a,b,c)}
J.bY=function(a){return J.I(a).aY(a)}
J.a3=function(a){return J.j(a).i(a)}
J.dR=function(a,b,c){return J.o(a).e3(a,b,c)}
I.bg=function(a){a.immutable$list=Array
a.fixed$length=Array
return a}
var $=I.p
C.q=J.d.prototype
C.c=J.az.prototype
C.a=J.cc.prototype
C.d=J.aA.prototype
C.h=J.aB.prototype
C.y=J.aC.prototype
C.m=J.eV.prototype
C.e=J.aK.prototype
C.n=new H.c3()
C.o=new P.fA()
C.b=new P.hc()
C.f=new P.T(0)
C.p=new P.T(6e4)
C.r=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
C.t=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
C.i=function(hooks) { return hooks; }

C.u=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var ua = navigator.userAgent;
    if (ua.indexOf("DumpRenderTree") >= 0) return hooks;
    if (ua.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
C.v=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (self.HTMLElement && object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof navigator == "object";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
C.w=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
C.x=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
C.j=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
C.z=new P.eG(null,null)
C.A=new P.eI(null,null)
C.k=I.bg([])
C.B=H.G(I.bg([]),[P.aJ])
C.l=new H.e1(0,{},C.B,[P.aJ,null])
C.C=new H.bx("call")
$.cq="$cachedFunction"
$.cr="$cachedInvocation"
$.J=0
$.ag=null
$.c_=null
$.bQ=null
$.dc=null
$.dp=null
$.bd=null
$.bf=null
$.bR=null
$.ab=null
$.ak=null
$.al=null
$.bI=!1
$.l=C.b
$.c7=0
$=null
init.isHunkLoaded=function(a){return!!$dart_deferred_initializers$[a]}
init.deferredInitialized=new Object(null)
init.isHunkInitialized=function(a){return init.deferredInitialized[a]}
init.initializeLoadedHunk=function(a){$dart_deferred_initializers$[a]($globals$,$)
init.deferredInitialized[a]=true}
init.deferredLibraryUris={}
init.deferredLibraryHashes={};(function(a){for(var z=0;z<a.length;){var y=a[z++]
var x=a[z++]
var w=a[z++]
I.$lazy(y,x,w)}})(["aU","$get$aU",function(){return H.bO("_$dart_dartClosure")},"bo","$get$bo",function(){return H.bO("_$dart_js")},"c9","$get$c9",function(){return H.er()},"ca","$get$ca",function(){if(typeof WeakMap=="function")var z=new WeakMap()
else{z=$.c7
$.c7=z+1
z="expando$key$"+z}return new P.ec(null,z)},"cG","$get$cG",function(){return H.M(H.b7({
toString:function(){return"$receiver$"}}))},"cH","$get$cH",function(){return H.M(H.b7({$method$:null,
toString:function(){return"$receiver$"}}))},"cI","$get$cI",function(){return H.M(H.b7(null))},"cJ","$get$cJ",function(){return H.M(function(){var $argumentsExpr$='$arguments$'
try{null.$method$($argumentsExpr$)}catch(z){return z.message}}())},"cN","$get$cN",function(){return H.M(H.b7(void 0))},"cO","$get$cO",function(){return H.M(function(){var $argumentsExpr$='$arguments$'
try{(void 0).$method$($argumentsExpr$)}catch(z){return z.message}}())},"cL","$get$cL",function(){return H.M(H.cM(null))},"cK","$get$cK",function(){return H.M(function(){try{null.$method$}catch(z){return z.message}}())},"cQ","$get$cQ",function(){return H.M(H.cM(void 0))},"cP","$get$cP",function(){return H.M(function(){try{(void 0).$method$}catch(z){return z.message}}())},"bA","$get$bA",function(){return P.fs()},"aX","$get$aX",function(){var z=new P.a8(0,P.fr(),null,[null])
z.cK(null,null)
return z},"ao","$get$ao",function(){return[]},"bL","$get$bL",function(){return P.db(self)},"bB","$get$bB",function(){return H.bO("_$dart_dartObject")},"bF","$get$bF",function(){return function DartObject(a){this.o=a}}])
I=I.$finishIsolateConstructor(I)
$=new I()
init.metadata=["error","stackTrace",null,"_","object","e","x","value","data","o","sender","closure","isolate","numberOfArguments","arg1","arg2","arg3","arg4","each","arg","callback","captureThis","self","arguments","canvasId"]
init.types=[{func:1},{func:1,args:[,]},{func:1,v:true},{func:1,v:true,args:[{func:1,v:true}]},{func:1,v:true,args:[,],opt:[P.aH]},{func:1,args:[,,]},{func:1,ret:P.H,args:[P.k]},{func:1,args:[P.H,,]},{func:1,args:[,P.H]},{func:1,args:[P.H]},{func:1,args:[{func:1,v:true}]},{func:1,args:[,],opt:[,]},{func:1,v:true,args:[,P.aH]},{func:1,args:[P.aJ,,]},{func:1,v:true,args:[P.cC]},{func:1,v:true,args:[,]},{func:1,ret:P.b,args:[,]},{func:1,v:true,args:[P.H]}]
function convertToFastObject(a){function MyClass(){}MyClass.prototype=a
new MyClass()
return a}function convertToSlowObject(a){a.__MAGIC_SLOW_PROPERTY=1
delete a.__MAGIC_SLOW_PROPERTY
return a}A=convertToFastObject(A)
B=convertToFastObject(B)
C=convertToFastObject(C)
D=convertToFastObject(D)
E=convertToFastObject(E)
F=convertToFastObject(F)
G=convertToFastObject(G)
H=convertToFastObject(H)
J=convertToFastObject(J)
K=convertToFastObject(K)
L=convertToFastObject(L)
M=convertToFastObject(M)
N=convertToFastObject(N)
O=convertToFastObject(O)
P=convertToFastObject(P)
Q=convertToFastObject(Q)
R=convertToFastObject(R)
S=convertToFastObject(S)
T=convertToFastObject(T)
U=convertToFastObject(U)
V=convertToFastObject(V)
W=convertToFastObject(W)
X=convertToFastObject(X)
Y=convertToFastObject(Y)
Z=convertToFastObject(Z)
function init(){I.p=Object.create(null)
init.allClasses=map()
init.getTypeFromName=function(a){return init.allClasses[a]}
init.interceptorsByTag=map()
init.leafTags=map()
init.finishedClasses=map()
I.$lazy=function(a,b,c,d,e){if(!init.lazies)init.lazies=Object.create(null)
init.lazies[a]=b
e=e||I.p
var z={}
var y={}
e[a]=z
e[b]=function(){var x=this[a]
if(x==y)H.i9(d||a)
try{if(x===z){this[a]=y
try{x=this[a]=c()}finally{if(x===z)this[a]=null}}return x}finally{this[b]=function(){return this[a]}}}}
I.$finishIsolateConstructor=function(a){var z=a.p
function Isolate(){var y=Object.keys(z)
for(var x=0;x<y.length;x++){var w=y[x]
this[w]=z[w]}var v=init.lazies
var u=v?Object.keys(v):[]
for(var x=0;x<u.length;x++)this[v[u[x]]]=null
function ForceEfficientMap(){}ForceEfficientMap.prototype=this
new ForceEfficientMap()
for(var x=0;x<u.length;x++){var t=v[u[x]]
this[t]=z[t]}}Isolate.prototype=a.prototype
Isolate.prototype.constructor=Isolate
Isolate.p=z
Isolate.bg=a.bg
Isolate.t=a.t
return Isolate}}!function(){var z=function(a){var t={}
t[a]=1
return Object.keys(convertToFastObject(t))[0]}
init.getIsolateTag=function(a){return z("___dart_"+a+init.isolateTag)}
var y="___dart_isolate_tags_"
var x=Object[y]||(Object[y]=Object.create(null))
var w="_ZxYxX"
for(var v=0;;v++){var u=z(w+"_"+v+"_")
if(!(u in x)){x[u]=1
init.isolateTag=u
break}}init.dispatchPropertyName=init.getIsolateTag("dispatch_record")}();(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!='undefined'){a(document.currentScript)
return}var z=document.scripts
function onLoad(b){for(var x=0;x<z.length;++x)z[x].removeEventListener("load",onLoad,false)
a(b.target)}for(var y=0;y<z.length;++y)z[y].addEventListener("load",onLoad,false)})(function(a){init.currentScript=a
if(typeof dartMainRunner==="function")dartMainRunner(function(b){H.dr(X.dm(),b)},[])
else (function(b){H.dr(X.dm(),b)})([])})})()



var TopCodes = {


  startStopVideoScan : function(canvasId) {
    TopCodes._mediaStreams[canvasId] ? 
      TopCodes.stopVideoScan(canvasId) : 
      TopCodes.startVideoScan(canvasId);
  },


  startVideoScan : function(canvasId) {
    // initialize the video scanner if necessary
    if (!(canvasId in TopCodes._mediaStreams)) {
      topcodes_initVideoScanner(canvasId);
    }
    var canvas = document.querySelector("#" + canvasId);
    var video = document.querySelector("#" + canvasId + "-video");
    if (canvas && video) {
      var vw = parseInt(canvas.getAttribute('width'));
      var vh = parseInt(canvas.getAttribute('height'));
      var vc = { audio: false, video: { mandatory : { minWidth: vw, maxWidth : vw, minHeight : vh, maxHeight : vh }}}; 
      navigator.mediaDevices.getUserMedia(vc)
        .then(function(mediaStream) {
          video.srcObject = mediaStream;
          TopCodes._mediaStreams[canvasId] = mediaStream;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },


  stopVideoScan : function(canvasId) {
    var video = document.querySelector("#" + canvasId + "-video");
    var mediaStream = TopCodes._mediaStreams[canvasId];
    if (video && mediaStream) {
      mediaStream.getTracks().forEach(function (track) { track.stop(); })
      TopCodes._mediaStreams[canvasId] = null;
      video.pause();
    }
  },


  setVideoFrameCallback : function(canvasId, callback) {
    TopCodes._callbacks[canvasId] = callback;
  },


  _relayFrameData : function(canvasId, json) {
    if (canvasId in TopCodes._callbacks) {
      TopCodes._callbacks[canvasId](json);
    }
  },


  _mediaStreams : { },
  _callbacks : { }
}
