-- MobileSentrix inventory import - Mega Wireless POS
-- Batch received 2026-10-13
-- Orders: 108724585 and 108736992
-- Behavior: insert new SKU; if SKU already exists, add received quantity and refresh latest unit cost.
-- Sale price is intentionally left unchanged for existing products and defaults to 0 for new repair parts.

begin;

insert into public.products
  (sku,name,category,cost,price,minimum_price,quantity,website_visible,active,track_individual_units)
values
('107082020114','Samsung Galaxy S10 Plus LCD Assembly w/ Frame TFT - Prism Blue','Repair Parts',37.71,0,0,1,false,true,false),
('107082020184','Samsung Galaxy S10 Plus Back Glass w/ Camera Lens - Prism Blue','Repair Parts',14.03,0,0,1,false,true,false),
('107082546465','Samsung Galaxy A16 5G A166B Charging Port w/ Board','Repair Parts',2.44,0,0,2,false,true,false),
('107183137110','Samsung Galaxy A16 5G A166P Charging Port w/ Board','Repair Parts',3.63,0,0,1,false,true,false),
('107081015577','Samsung Galaxy A32 4G A325 LCD Assembly w/ Frame Incell - Black','Repair Parts',13.25,0,0,2,false,true,false),
('107082088233','Samsung Galaxy A32 A325 Charging Port w/ PCB Board','Repair Parts',2.35,0,0,2,false,true,false),
('107082133497','Samsung Galaxy A32 5G A326 LCD Assembly No Frame - Black','Repair Parts',9.86,0,0,2,false,true,false),
('107182136582','iPhone 15 Pro Max OLED Assembly XO7 Soft 120Hz','Repair Parts',39.79,0,0,2,false,true,false),
('107083546478','iPhone 15 Pro Max LCD Assembly AQ7 Incell 120Hz','Repair Parts',23.50,0,0,1,false,true,false),
('107082069206','iPhone 11 Pro Max LCD Assembly AQ7 Incell','Repair Parts',13.75,0,0,2,false,true,false),
('107082069106','iPhone 11 LCD Assembly w/ Steel Plate AQ7 Incell','Repair Parts',14.01,0,0,2,false,true,false),
('107082004816','iPhone 11 LCD Assembly w/ Steel Plate XO7 Incell','Repair Parts',16.56,0,0,1,false,true,false)
on conflict (sku) do update set
  name=excluded.name,
  category=excluded.category,
  cost=excluded.cost,
  quantity=public.products.quantity+excluded.quantity,
  active=true,
  updated_at=now();

commit;
