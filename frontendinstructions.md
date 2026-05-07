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

