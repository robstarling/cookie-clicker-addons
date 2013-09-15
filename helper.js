(function(undefined,window,document,logFn,G){

  var helper = {

    "p3sf": function(x) {
      var s=Array('','k','M','G','T','P','E','Z','Y');
      var commas=0;
      while(x>1000){
        //console.log(x);
        commas+=1;x/=1000
      };
      //console.log("commas = "+commas);
      x=""+x;
      if(x.length>4){x=x.substring(0,4)};
      if(x[x.length-1]=="."){x=x.substring(0,x.length-1)};
      return x+s[commas];
    },

    "dur": function(sec) {
      s="";
      if(sec>=86400){var d=Math.floor(sec/86400); sec-=d*86400; s+=""+d+"day, "};
      if(sec>=3600){var h=Math.floor(sec/3600); sec-=h*3600; s+=""+h+"hr, "};
      if(sec>=60){var m=Math.floor(sec/60); sec-=m*60; s+=""+m+"min, "};
      if(sec>0 || s==""){s+=""+sec+"sec"};
      if(s[s.length-1]==" "){s=s.substring(0,s.length-2)};
      return s;
    },

    "advise": function(printer) {
      var p3sf = this.p3sf;
      var dur = this.dur;
      var log = (printer == undefined) ? logFn : printer;
      log("Now: "+p3sf(G.cookies)+" +"+p3sf(G.cookiesPs)+"/s (+"+
          p3sf(G.cookiesPs*60)+"/min, "+p3sf(G.cookiesPs*3600)+"/hr, "+
          p3sf(G.cookiesPs*86400)+"/day)");
      log("");
      var best=undefined;
      for(var i=0; i < G.ObjectsById.length; i++) {
        var o = G.ObjectsById[i];
        var oCps = o.cps();
        var opCps = o.price/oCps;
        log(o.name+" ("+p3sf(o.amount*oCps)+"/s total) -> +"+p3sf(oCps)+"/s => "+
            p3sf(opCps)+"/cps");
        if(o.price<G.cookies) {
          log(">     Can buy ~"+Math.floor(G.cookies/o.price)+" now for "+p3sf(o.price));
          if(best==undefined || opCps < best.pCps) {
            best = {pCps: opCps, o: o};
          }
        } else {
          log(">     Could buy one in "+
              dur(Math.ceil((o.price-G.cookies)/G.cookiesPs))+" for "+p3sf(o.price));
        }
      }
      if(best!=undefined) {
        log("");
        log("Best option now: "+best.o.name);
      }
      log("");
      for(var i=0; i < G.UpgradesInStore.length; i++) {
        var u = G.UpgradesInStore[i];
        var m = u.name+" (cost: "+p3sf(u.basePrice)+")";
        if(u.basePrice<G.cookies) {
          log(m + ", Can buy now.");
        } else {
          log(m + ", in "+ dur(Math.ceil((u.basePrice-G.cookies)/G.cookiesPs)));
        }
      }
    },

    "advicePopup": function() {
      var out = "";
      var printer = function(s) { out += "\n" + s; }
      this.advise(printer);
      alert(out);
    }
  };

  window.Helper = helper;

  var r=document.createElement("div");
  r.setAttribute('id','rHelper');
  r.innerHTML='<a href="javascript:Helper.advicePopup();false;"><img src="http://robstarling.org/photo/me_icon.gif"></a>';
  r.style.position='absolute';
  r.style.width=31;
  r.style.height=38;
  r.style.top='35px';
  r.style.right='20px';
  document.body.appendChild(r);

})(undefined,window,document,function(s){console.log(s)},Game);
