// Live flow diagrams: service page flows (.flowbox) and case card strips (.mini-flow).
// Each flowbox runs once when scrolled into view and can be replayed. No outside scripts.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = 'http://www.w3.org/2000/svg';
  var ICONS = {
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
    fork: '<path d="M6 3v6a6 6 0 0 0 6 6h6M6 9v12M15 12l3 3-3 3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    stop: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };

  // Each flow has its own shape. Runs list the stages one replay steps through;
  // flows with more than one run take the next path on each replay.
  var FLOWS = {
    leasing: {
      shape: 'Three documents at once', cols: 5, rows: 3,
      nodes: [
        { id: 'in', col: 1, icon: 'bolt', title: 'Applicant approved', sub: 'The status changes' },
        { id: 'pull', col: 2, icon: 'list', title: 'Pull the details', sub: 'Name, unit, rent, dates' },
        { id: 'letter', col: 3, row: 1, icon: 'doc', title: 'Approval letter', sub: 'Filled in' },
        { id: 'lease', col: 3, row: 2, icon: 'doc', title: 'Lease', sub: 'Ready to sign' },
        { id: 'money', col: 3, row: 3, icon: 'doc', title: 'Move-in summary', sub: 'Every fee totaled' },
        { id: 'review', col: 4, icon: 'user', title: 'Quick review', sub: 'Your team approves', approve: true },
        { id: 'done', col: 5, icon: 'send', title: 'Sent and filed', sub: 'In the daily report' }
      ],
      edges: [['in', 'pull'], ['pull', 'letter'], ['pull', 'lease'], ['pull', 'money'], ['letter', 'review'], ['lease', 'review'], ['money', 'review'], ['review', 'done']],
      runs: [[
        { n: ['in'] }, { e: [['in', 'pull']], n: ['pull'] },
        { e: [['pull', 'letter'], ['pull', 'lease'], ['pull', 'money']], n: ['letter', 'lease', 'money'] },
        { e: [['letter', 'review'], ['lease', 'review'], ['money', 'review']], n: ['review'] },
        { e: [['review', 'done']], n: ['done'] }
      ]]
    },
    maintenance: {
      shape: 'Weekly check, two paths', cols: 5, rows: 2,
      nodes: [
        { id: 'in', col: 1, icon: 'clock', title: 'Every Monday', sub: 'Starts on its own' },
        { id: 'find', col: 2, icon: 'tool', title: 'Find stalled jobs', sub: 'Open past your cutoff' },
        { id: 'who', col: 3, icon: 'fork', title: 'Waiting on whom?', sub: 'Vendor or resident' },
        { id: 'vendor', col: 4, row: 1, icon: 'send', title: 'Nudge the vendor', sub: 'Personal status request' },
        { id: 'res', col: 4, row: 2, icon: 'users', title: 'Update the resident', sub: 'No phone call needed' },
        { id: 'done', col: 5, icon: 'chart', title: 'Open jobs report', sub: 'Managers see what waits' }
      ],
      edges: [['in', 'find'], ['find', 'who'], ['who', 'vendor'], ['who', 'res'], ['vendor', 'done'], ['res', 'done']],
      runs: ['vendor', 'res'].map(function (p) {
        return [{ n: ['in'] }, { e: [['in', 'find']], n: ['find'] }, { e: [['find', 'who']], n: ['who'], d: 1 }, { e: [['who', p]], n: [p] }, { e: [[p, 'done']], n: ['done'] }];
      })
    },
    bookkeeping: {
      shape: 'Three rules, one gate', cols: 5, rows: 3,
      nodes: [
        { id: 'in', col: 1, icon: 'mail', title: 'Bill comes in', sub: 'Water, gas, or invoice' },
        { id: 'pull', col: 2, icon: 'list', title: 'Pull the details', sub: 'Property, amount, dates' },
        { id: 'gate', col: 3, icon: 'shield', title: 'Check the rules', sub: 'Same way every time' },
        { id: 'ok', col: 4, row: 1, icon: 'check', title: 'Normal? Log it', sub: 'No one has to look' },
        { id: 'odd', col: 4, row: 2, icon: 'bell', title: 'Unusual? Flag it', sub: 'A person takes a look' },
        { id: 'dup', col: 4, row: 3, icon: 'stop', title: 'Duplicate? Stop it', sub: 'Never paid twice' },
        { id: 'done', col: 5, icon: 'doc', title: 'Books up to date', sub: 'Matched to each property' }
      ],
      edges: [['in', 'pull'], ['pull', 'gate'], ['gate', 'ok'], ['gate', 'odd'], ['gate', 'dup'], ['ok', 'done'], ['odd', 'done']],
      runs: ['ok', 'odd', 'dup'].map(function (p) {
        var r = [{ n: ['in'] }, { e: [['in', 'pull']], n: ['pull'] }, { e: [['pull', 'gate']], n: ['gate'], d: 1 }, { e: [['gate', p]], n: [p] }];
        if (p !== 'dup') r.push({ e: [[p, 'done']], n: ['done'] });
        return r;
      })
    },
    marketing: {
      shape: 'One upload, everywhere at once', cols: 4, rows: 3,
      nodes: [
        { id: 'in', col: 1, icon: 'video', title: 'One video uploaded', sub: 'That is the only step' },
        { id: 'ai', col: 2, icon: 'spark', title: 'AI writes captions', sub: 'One for each platform', ai: true },
        { id: 'a', col: 3, row: 1, icon: 'send', title: 'Instagram and Facebook', sub: 'Posted' },
        { id: 'b', col: 3, row: 2, icon: 'send', title: 'LinkedIn', sub: 'Posted' },
        { id: 'c', col: 3, row: 3, icon: 'send', title: 'TikTok and YouTube', sub: 'Posted' },
        { id: 'done', col: 4, icon: 'check', title: 'Live everywhere', sub: 'Same day, no retyping' }
      ],
      edges: [['in', 'ai'], ['ai', 'a'], ['ai', 'b'], ['ai', 'c'], ['a', 'done'], ['b', 'done'], ['c', 'done']],
      runs: [[
        { n: ['in'] }, { e: [['in', 'ai']], n: ['ai'] },
        { e: [['ai', 'a'], ['ai', 'b'], ['ai', 'c']], n: ['a', 'b', 'c'] },
        { e: [['a', 'done'], ['b', 'done'], ['c', 'done']], n: ['done'] }
      ]]
    },
    ecommerce: {
      shape: 'Straight line, with a wait', cols: 5, rows: 1,
      nodes: [
        { id: 'in', col: 1, icon: 'cart', title: 'New order', sub: 'Any time of day' },
        { id: 'log', col: 2, icon: 'chart', title: 'Order logged', sub: 'Revenue updated' },
        { id: 'thanks', col: 3, icon: 'mail', title: 'Thank-you email', sub: 'Sent right away' },
        { id: 'wait', col: 4, icon: 'clock', title: 'Wait 14 days', sub: 'Time to try it' },
        { id: 'review', col: 5, icon: 'star', title: 'Review request', sub: 'At the right moment' }
      ],
      edges: [['in', 'log'], ['log', 'thanks'], ['thanks', 'wait'], ['wait', 'review']],
      runs: [[
        { n: ['in'] }, { e: [['in', 'log']], n: ['log'] }, { e: [['log', 'thanks']], n: ['thanks'] },
        { e: [['thanks', 'wait']], n: ['wait'], slow: 1 }, { e: [['wait', 'review']], n: ['review'] }
      ]]
    },
    homeservices: {
      shape: 'Follow up until they answer', cols: 5, rows: 2,
      nodes: [
        { id: 'in', col: 1, icon: 'doc', title: 'Quote sent', sub: 'To the customer' },
        { id: 'wait', col: 2, icon: 'clock', title: 'Wait 2 days', sub: 'Give them time' },
        { id: 'ask', col: 3, icon: 'fork', title: 'Did they reply?', sub: 'Checked for you' },
        { id: 'book', col: 4, row: 1, icon: 'check', title: 'Yes: book the job', sub: 'Reminder scheduled' },
        { id: 'nudge', col: 4, row: 2, icon: 'send', title: 'No: friendly nudge', sub: 'Then wait again' },
        { id: 'done', col: 5, icon: 'star', title: 'Review request', sub: 'After the job is done' }
      ],
      edges: [['in', 'wait'], ['wait', 'ask'], ['ask', 'book'], ['ask', 'nudge'], ['book', 'done'], ['nudge', 'wait', 'loop']],
      runs: [[
        { n: ['in'] }, { e: [['in', 'wait']], n: ['wait'] }, { e: [['wait', 'ask']], n: ['ask'] },
        { e: [['ask', 'nudge']], n: ['nudge'] }, { e: [['nudge', 'wait']], n: ['wait'], again: 1 },
        { e: [['wait', 'ask']], n: ['ask'] }, { e: [['ask', 'book']], n: ['book'] }, { e: [['book', 'done']], n: ['done'] }
      ]]
    },
    ai: {
      shape: 'AI drafts, you approve', cols: 5, rows: 1,
      nodes: [
        { id: 'in', col: 1, icon: 'mail', title: 'Messy email arrives', sub: 'Long, rambling, real' },
        { id: 'read', col: 2, icon: 'spark', title: 'AI pulls the details', sub: 'Names, dates, amounts', ai: true },
        { id: 'draft', col: 3, icon: 'spark', title: 'AI drafts the reply', sub: 'In your tone', ai: true },
        { id: 'ok', col: 4, icon: 'user', title: 'You approve', sub: 'One tap', approve: true },
        { id: 'done', col: 5, icon: 'send', title: 'Sent and logged', sub: 'Nothing retyped' }
      ],
      edges: [['in', 'read'], ['read', 'draft'], ['draft', 'ok'], ['ok', 'done']],
      runs: [[
        { n: ['in'] }, { e: [['in', 'read']], n: ['read'] }, { e: [['read', 'draft']], n: ['draft'] },
        { e: [['draft', 'ok']], n: ['ok'] }, { e: [['ok', 'done']], n: ['done'] }
      ]]
    }
  };

  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  function k(e) { return e[0] + '>' + e[1]; }

  function Flow(box) {
    var def = FLOWS[box.dataset.flow];
    if (!def) return;
    var self = this, runIndex = 0, busy = false;
    var aiCount = def.nodes.filter(function (n) { return n.ai; }).length;
    box.innerHTML = '<div class="fb-bar"><span class="fb-shape"></span><span class="fb-ai"></span><button type="button" class="fb-replay">Run it again</button></div><div class="fb-canvas"><svg class="fb-wires" aria-hidden="true"></svg><div class="fb-grid"></div></div>';
    box.querySelector('.fb-shape').textContent = def.shape;
    box.querySelector('.fb-ai').textContent = aiCount ? 'AI in ' + aiCount + (aiCount > 1 ? ' steps' : ' step') : 'No AI needed';
    var canvas = box.querySelector('.fb-canvas'), wires = box.querySelector('.fb-wires'), grid = box.querySelector('.fb-grid'), replay = box.querySelector('.fb-replay');
    grid.style.setProperty('--cols', def.cols); grid.style.setProperty('--rows', def.rows); grid.dataset.rows = def.rows;
    var els = {}, paths = {};
    def.nodes.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'fb-node';
      el.style.setProperty('--c', n.col); el.style.setProperty('--r', n.row || 1); el.style.setProperty('--span', n.row ? 1 : def.rows);
      el.innerHTML = '<span class="fb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n.icon] + '</svg></span><span class="fb-text"><b></b><small></small></span>';
      el.querySelector('b').textContent = n.title;
      el.querySelector('small').textContent = n.sub;
      if (n.ai) { var chip = document.createElement('i'); chip.className = 'fb-chip'; chip.textContent = 'AI'; el.querySelector('b').appendChild(chip); }
      grid.appendChild(el); els[n.id] = el;
    });
    def.edges.forEach(function (e) {
      var p = document.createElementNS(SVG, 'path');
      p.setAttribute('class', e[2] === 'loop' ? 'fb-wire loop' : 'fb-wire');
      wires.appendChild(p); paths[k(e)] = p;
    });

    function box2(el) { var c = canvas.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - c.left, t: r.top - c.top, r: r.right - c.left, b: r.bottom - c.top, w: r.width, h: r.height }; }
    function draw() {
      var f0 = box2(els[def.nodes[0].id]), f1 = box2(els[def.nodes[1].id]), wide = f1.l >= f0.r - 2;
      def.edges.forEach(function (e) {
        var a = box2(els[e[0]]), b = box2(els[e[1]]), d;
        if (e[2] === 'loop') {
          if (wide) {
            var low = Math.max(a.b, b.b) + 20, x1 = a.l + a.w / 2, x2 = b.l + b.w / 2;
            d = 'M' + x1 + ',' + a.b + ' Q' + x1 + ',' + low + ' ' + (x1 - 20) + ',' + low + ' L' + (x2 + 20) + ',' + low + ' Q' + x2 + ',' + low + ' ' + x2 + ',' + b.b;
          } else {
            var side = Math.max(a.r, b.r) + 8, y1 = a.t + a.h / 2, y2 = b.t + b.h / 2;
            d = 'M' + a.r + ',' + y1 + ' Q' + side + ',' + y1 + ' ' + side + ',' + (y1 - 16) + ' L' + side + ',' + (y2 + 16) + ' Q' + side + ',' + y2 + ' ' + b.r + ',' + y2;
          }
        } else if (wide) {
          var p1 = [a.r, a.t + a.h / 2], p2 = [b.l, b.t + b.h / 2], dx = (p2[0] - p1[0]) / 2;
          d = 'M' + p1 + ' C' + (p1[0] + dx) + ',' + p1[1] + ' ' + (p2[0] - dx) + ',' + p2[1] + ' ' + p2;
        } else {
          var q1 = [a.l + a.w / 2, a.b], q2 = [b.l + b.w / 2, b.t], dy = (q2[1] - q1[1]) / 2;
          d = 'M' + q1 + ' C' + q1[0] + ',' + (q1[1] + dy) + ' ' + q2[0] + ',' + (q2[1] - dy) + ' ' + q2;
        }
        paths[k(e)].setAttribute('d', d);
      });
    }
    function travel(key, ms) {
      var path = paths[key];
      return new Promise(function (resolve) {
        if (reduce) return resolve();
        var dot = document.createElementNS(SVG, 'circle'), len = path.getTotalLength(), start = null, p0 = path.getPointAtLength(0);
        dot.setAttribute('r', 5); dot.setAttribute('class', 'fb-packet'); dot.setAttribute('cx', p0.x); dot.setAttribute('cy', p0.y);
        wires.appendChild(dot);
        function step(t) {
          if (start === null) start = t;
          var q = Math.min((t - start) / ms, 1), ease = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2, pt = path.getPointAtLength(ease * len);
          dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
          if (q < 1) requestAnimationFrame(step); else { dot.remove(); resolve(); }
        }
        requestAnimationFrame(step);
      });
    }
    function reset() {
      Object.keys(els).forEach(function (id) { els[id].className = 'fb-node'; var s = els[id].querySelector('.fb-stamp'); if (s) s.remove(); });
      Object.keys(paths).forEach(function (key) { paths[key].classList.remove('lit', 'skip'); });
    }
    self.run = async function () {
      if (busy) return;
      busy = true; replay.disabled = true; reset(); draw();
      var stages = def.runs[runIndex % def.runs.length], used = {}, usedE = {};
      runIndex++;
      stages.forEach(function (s) { s.n.forEach(function (n) { used[n] = 1; }); (s.e || []).forEach(function (e) { usedE[k(e)] = 1; }); });
      for (var i = 0; i < stages.length; i++) {
        var s = stages[i], edges = s.e || [];
        edges.forEach(function (e) { paths[k(e)].classList.add('lit'); });
        await Promise.all(edges.map(function (e) { return travel(k(e), (paths[k(e)].classList.contains('loop') ? 1100 : 600) * (s.slow ? 1.8 : 1)); }));
        for (var j = 0; j < s.n.length; j++) {
          var el = els[s.n[j]], nd = def.nodes.filter(function (n) { return n.id === s.n[j]; })[0];
          el.classList.remove('done'); el.classList.add('active');
          if (nd.approve) {
            await wait(700);
            var stamp = document.createElement('span'); stamp.className = 'fb-stamp'; stamp.textContent = 'Approved';
            el.appendChild(stamp);
          }
        }
        if (s.d) {
          Object.keys(els).forEach(function (id) { if (!used[id]) els[id].classList.add('skipped'); });
          Object.keys(paths).forEach(function (key) { if (!usedE[key]) paths[key].classList.add('skip'); });
        }
        await wait(s.slow ? 700 : 380);
        s.n.forEach(function (id) { els[id].classList.remove('active'); els[id].classList.add('done'); });
      }
      busy = false; replay.disabled = false;
      replay.textContent = def.runs.length > 1 ? 'Run it again (next path)' : 'Run it again';
    };
    replay.addEventListener('click', function () { self.run(); });
    self.draw = draw;
    draw();
  }

  var flows = [];
  document.querySelectorAll('.flowbox').forEach(function (box) {
    var f = new Flow(box);
    if (!f.run) return;
    flows.push(f);
    if (reduce || !('IntersectionObserver' in window)) { f.run(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); f.run(); }
    }, { threshold: 0.35 });
    io.observe(box);
  });

  // Case card strips: "Step | Step | Step | Result" lights up left to right when the card scrolls in.
  var strips = document.querySelectorAll('.mini-flow');
  strips.forEach(function (strip) {
    var steps = (strip.dataset.steps || '').split('|');
    strip.setAttribute('aria-label', 'How it runs: ' + steps.join(', then '));
    strip.setAttribute('role', 'img');
    steps.forEach(function (s, i) {
      if (i) { var w = document.createElement('span'); w.className = 'mf-wire'; w.setAttribute('aria-hidden', 'true'); strip.appendChild(w); }
      var st = document.createElement('span'); st.className = 'mf-step'; st.setAttribute('aria-hidden', 'true'); st.textContent = s;
      strip.appendChild(st);
    });
  });
  function light(strip) {
    var parts = strip.children;
    for (var i = 0; i < parts.length; i++) (function (el, i) { setTimeout(function () { el.classList.add('on'); }, reduce ? 0 : i * 260); })(parts[i], i);
  }
  if (strips.length) {
    if (reduce || !('IntersectionObserver' in window)) strips.forEach(light);
    else {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { io2.unobserve(en.target); light(en.target); } });
      }, { threshold: 0.6 });
      strips.forEach(function (s) { io2.observe(s); });
    }
  }

  var raf;
  window.addEventListener('resize', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { flows.forEach(function (f) { f.draw(); }); }); });
})();
