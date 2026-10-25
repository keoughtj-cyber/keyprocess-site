# Draws the site's card-style SVG illustrations into images/ (service page heroes and in-post images).
# Add a card(...) call for a new page or post, then run: python3 docs/illustrations.py
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images')
F='font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"'
CH={'green':('#dcf3ea','#12805c'),'blue':('#e9eef6','#1f3a68'),'amber':('#fdf1d6','#9a6400')}
def esc(s): return s.replace('&','&amp;')
def card(name,label,title,sub,badge,rows):
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" role="img" aria-label="{esc(label)}">',
       '<rect width="480" height="320" rx="22" fill="#0f1a33"/>',
       '<rect x="24" y="24" width="432" height="272" rx="16" fill="#fff"/>',
       f'<g {F}>',
       f'<text x="48" y="62" font-size="15" font-weight="700" fill="#14213d">{esc(title)}</text>',
       f'<text x="48" y="82" font-size="11.5" fill="#4a5568">{esc(sub)}</text>']
    bw=len(badge)*7.4+28
    o.append(f'<rect x="{432-bw}" y="44" width="{bw}" height="30" rx="15" fill="#fff6e0" stroke="#f4b740"/>')
    o.append(f'<text x="{432-bw/2}" y="64" font-size="12" font-weight="700" fill="#9a6400" text-anchor="middle">{esc(badge)}</text>')
    y=104
    for text,chip,col in rows:
        bg,fg=CH[col]
        o.append(f'<rect x="48" y="{y}" width="384" height="40" rx="10" fill="#f4f7fb"/>')
        o.append(f'<circle cx="70" cy="{y+20}" r="10" fill="{bg}"/>')
        if col=='amber':
            o.append(f'<path d="M70 {y+14}v7M70 {y+25}v.5" stroke="{fg}" stroke-width="2.5" stroke-linecap="round"/>')
        else:
            o.append(f'<path d="M65 {y+20}l3.5 3.5 6.5-7" stroke="{fg}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
        o.append(f'<text x="90" y="{y+24.5}" font-size="13" font-weight="600" fill="#14213d">{esc(text)}</text>')
        cw=len(chip)*7+24
        o.append(f'<rect x="{420-cw}" y="{y+9}" width="{cw}" height="22" rx="11" fill="{bg}"/>')
        o.append(f'<text x="{420-cw/2}" y="{y+24}" font-size="11.5" font-weight="700" fill="{fg}" text-anchor="middle">{esc(chip)}</text>')
        y+=46
    o.append('</g></svg>')
    open(os.path.join(OUT,name+'.svg'),'w').write('\n'.join(o)+'\n')

G='green'
card('home-services-hero','Illustration of a day of quote follow-ups, reminders, review requests, and invoice reminders sent on their own',
 "Today's customer follow-ups",'Sent on their own, in your words','All sent',
 [('Quote follow-up',"Sent",G),('Appointment reminder','Sent',G),('Review request','Sent',G),('Invoice reminder','Paid',G)])
card('ecommerce-hero','Illustration of a monthly product launch where the site feature, coupon codes, email, and social posts all go out on schedule',
 'Product of the month','Launched on schedule','On time',
 [('Website feature','Live',G),('Coupon codes','Created',G),('Email campaign','Sent',G),('Social posts','Posted',G)])
card('leasing-hero','Illustration of a lease approval where the letter, payment summary, lease, and daily report are prepared automatically',
 'Lease approval','Paperwork that builds itself','10 min',
 [('Approval letter','Ready',G),('Payment summary','Ready',G),('Lease for signing','Ready',G),('Daily approvals report','Sent',G)])
card('maintenance-hero','Illustration of Monday work order follow-ups going out to vendors with replies coming back to the team',
 'Monday work order follow-ups','Every stalled job, chased','Monday',
 [('Open 14+ days','Chased',G),('Vendor status request','Sent',G),('Vendor reply','Received','blue'),('Weekly maintenance report','Sent',G)])
card('bookkeeping-hero','Illustration of utility payments matched to the right property and logged, with only one flagged for a closer look',
 "Today's utility payments",'Matched to the right property','1 to review',
 [('Water bill, Property A','Logged',G),('Water bill, Property B','Logged',G),('Sewer bill, Property C','Logged',G),('Amount looks off','Review','amber')])
card('marketing-hero','Illustration of new rentals, price drops, and rented units updated everywhere, and one video published to five platforms',
 'Rental marketing this week','Updated everywhere, no copy and paste','All live',
 [('New rental posted','Live',G),('Price drop','Updated',G),('Rented unit','Removed',G),('Video on 5 platforms','Published',G)])
card('pricing-guide','Illustration of the three ways to buy automation: a single process from $1,000, a package from $3,000, and Automation Care from $500 a month',
 'What automation costs','Fixed quote before any work starts','Free audit',
 [('One automated process','From $1,000','blue'),('Package of 3 to 5','From $3,000','blue'),('Automation Care','From $500/mo','blue'),('30-day time-back guarantee','Included',G)])
card('pm-tasks','Illustration of property management tasks running on their own across leasing, maintenance, accounting, and marketing',
 'Property management tasks','Running on their own','25 ideas',
 [('Leasing paperwork','Automated',G),('Work order follow-ups','Automated',G),('Utility bills','Automated',G),('Listings and social posts','Automated',G)])
card('business-processes',"Illustration of a small business's weekly processes running on their own: lead follow-ups, reminders, invoices, and reports",
 'This week, on autopilot','Repetitive work your team stopped doing by hand','Running',
 [('New lead follow-ups','Sent',G),('Appointment reminders','Sent',G),('Invoice reminders','Sent',G),('Monday report','Delivered','blue')])
card('rd-credit-test','Illustration of the four questions a project must pass for the federal R&D tax credit, with the last two marked as questions for your CPA',
 'R&D tax credit: the four-part test','Every question must be a yes','Ask your CPA',
 [('Building or improving something?','Check',G),('Relies on computer science?','Check',G),('Unsure how at the start?','Ask','amber'),('Tested different approaches?','Ask','amber')])
card('ai-hero','Illustration of AI steps inside a workflow: captions drafted, details pulled from a messy email, a reply drafted, and one item held for a person to approve',
 'AI inside your workflow','Drafts and details, ready for review','You approve',
 [('Captions for 5 platforms','Drafted',G),('Details from a messy email','Pulled',G),('Product description','Drafted',G),('Reply to a customer','Review','amber')])
