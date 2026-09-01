var typeOpts = document.querySelectorAll('.type-opt');
  var pagesSlider = document.getElementById('pages');
  var pagesVal = document.getElementById('pagesVal');
  var feats = document.querySelectorAll('#featGrid input');
  var rush = document.getElementById('rush');
  var lowPrice = document.getElementById('lowPrice');
  var highPrice = document.getElementById('highPrice');
  var daysEst = document.getElementById('daysEst');
  var perPageRate = { landing: 40, ecom: 55, app: 90 };
  var baseDays = { landing: [3,5], ecom: [5,7], app: [10,14] };
  var activeType = 'landing';
  function includedPages(type){ if(type === 'landing') return 1; if(type === 'ecom') return 5; return 6; }
  function calcEstimate(){
    var base = parseInt(document.querySelector('.type-opt.active').dataset.base, 10);
    var pageCount = parseInt(pagesSlider.value, 10);
    var extraPages = Math.max(0, pageCount - includedPages(activeType));
    var pageCost = extraPages * perPageRate[activeType];
    var featCost = 0;
    feats.forEach(function(f){ if(f.checked) featCost += parseInt(f.dataset.cost, 10); });
    var total = base + pageCost + featCost;
    var low = Math.round(total * 0.9); var high = Math.round(total * 1.25);
    if(rush.checked){ low = Math.round(low * 1.25); high = Math.round(high * 1.25); }
    lowPrice.textContent = low.toLocaleString(); highPrice.textContent = high.toLocaleString();
    var dLow = baseDays[activeType][0]; var dHigh = baseDays[activeType][1];
    if(rush.checked){ dLow = Math.max(2, Math.round(dLow*0.6)); dHigh = Math.max(dLow+1, Math.round(dHigh*0.6)); }
    daysEst.textContent = 'Typical delivery: ' + dLow + '\u2013' + dHigh + ' days';
    pagesVal.textContent = pageCount + (pageCount === 1 ? ' page' : ' pages');
  }
  typeOpts.forEach(function(opt){
    opt.addEventListener('click', function(){
      typeOpts.forEach(function(o){ o.classList.remove('active'); });
      opt.classList.add('active'); activeType = opt.dataset.type; calcEstimate();
    });
  });
  pagesSlider.addEventListener('input', calcEstimate);
  feats.forEach(function(f){ f.addEventListener('change', calcEstimate); });
  rush.addEventListener('change', calcEstimate);
  calcEstimate();
