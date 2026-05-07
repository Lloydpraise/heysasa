# heysasa


##   Main Dashboard Code will be a skeleton structure code.
the rest of the code, will be injected using js

GET Started.  ---> Server 1 = make your bot
              ---> Sever 2 = evolution API GO. initiate whatsapp web qr scan.

              COntinue WhatsApp Set Up. 


    On Getstarted remove the slider and use buttons. remove free trial let them be  in button form. on laptop remove it and lets keep the scroll for mobile.
    Top up Now  ---> Payments.js  --> trigger edge function for payment Mpesa STK PUSH. Will be build on IntraSend
            Opens Dashboard.

        WIthout credits you cannot send messages to real clients.
        

Dashboard -- html file skeleton.
all the data loading will be using js.

products.js
leads.js
playground.js
knowledgebase.js
analytics.js
settings.js
profile.js
supabaseClient.js

Products. 
Discovered Products.
Added Products. 
Image | title, description... | Price  on far right (eclipse menu -- delete, edit)

We have 2 Views of products --> List view - focus on tables, 
image view - focus on images. 
create using mock data then remove mock data and add supabase.
(copy and paste into gemini it will know how to guide your workflow). also give it the dashboard.html so that it tells you what to change.


Implement Lazyloading on the products page. this means all images are not loaded at once. products load when products section is open, then only the products the user is looking at are loaded as they scroll more products load. 

Create a search bar that will be searching by title, description to search.

ADD PRODUCTS.
Extract the logic of aiimporter.html --- in its ability to analyse products and add to the system. then allow the user to edit the price, description and short description(just like the file) but now ;
Load it in a modal -- this modal has 2 screens --- screen 1 is the upload screen while screen 2 is the results screen. before the products are saved the user needs to edit.

then have a Save All button at the top right of the modal. when clicked it opens a "Please confirm all info and prices are correct before saving. '2 buttons 'Keep Editing(no boarder)'  "Confirm'(green button)

On the products page add an alphabet Slider --> a - z on the right side which allows the user 

### LEADS SECTION.

Whats on the page is just a rough idea of what i have in mind. it should be refined. 
see how best to arrange the information we are trying to pass, giving the most vital in the list view, and the details in drawers/modals. the chat should be in the modal. let it reflect clearly ai message and user message eg - on left leads message is grey - user message is green and ai message is orange.(both on the right)

There will be a button with "execute next step" right below next step - ideally this should be sent to the follow up ai to figure out when to send it(or the user can decide to send it themselves but by default it should be sent by ai) find a nice way of saying and showing that.

The button at the top right of leads section can be reused as Add Lead. its for manually adding the lead we will figure it out.

On top of the name and phone we might be trying to showcase these sets of info - which the system is already made to draw:

* items we are showing *

Lead Identity: The name pulled from WhatsApp and the phone number.

The "Heat" Badge: A color-coded indicator (e.g., Red for "Hot," Orange for "Warm") derived from the AI's assessment of lead_quality.

Current Stage: A status label (e.g., "Price Inquiry" or "Delivery Setup") that shows where the lead is in the funnel.

Product of Interest: A quick summary of items currently in the cart_state (e.g., "200W Solar Panel").

Intent Preview: A one-sentence snippet of the customer_intent to give immediate context.

2. The Lead Intelligence Drawer (The "Deep Dive")
When a lead is selected, a slide-over drawer provides the "Strategist" AI's findings:

Customer Intent & Psychology: An explanation of the lead's motivation (e.g., "Looking for a bargain" or "Concerned about warranty").

Next Suggested Action: A specific recommendation on how to move the sale forward based on the next_action_plan.

Trust Markers: Indicators of what helped build rapport, such as a positive response to M-Pesa Till details.

Vibe Check: A summary of the conversation's tone (e.g., "Polite but urgent") to help the owner match the customer's energy.

3. The Action Layer
To make the dashboard functional rather than just informative, we include:

The "One-Click Nudge": A prominent button that opens a pre-filled WhatsApp link using the next_action_plan text.(for manual) or send the message to the follow up ai(to be queued for auto)

Direct Execution: This allows the owner to send the AI-scripted follow-up immediately without having to type it out themselves.

(by giving this right on the leads section we offer instant value. allow users to understand what is happening with their leads - see them in analytics mode rather than emotional mode which is how they increase changes of closing them.)
