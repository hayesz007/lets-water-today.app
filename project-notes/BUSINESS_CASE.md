# Business case

## 1. The idea

- **Customer:** Apartment/condo dwelling DIY car enthusiasts in mid sized cities. They work on their own cars brakes, suspension/exhaust but dont have their own garage, private driveway or lift. 
- **Problem:** Right now they either work illegally/uncomfortably. They overpay at full-service repair shops or beg their friends. 
- **Solution:** With BayShare, it lets them browse, filter as well as book verified local garage bays, lifts and tools. There is instant availability and clear rules. 
- **Revenue:** BayShare takes a 15% service fee per hourly bay booking plus an optional host protection/listing tier. 

Example: an average booking could be a renter reserving a heated residential bay with a two-post lift for three hours on a Saturday morning at $30 per hour to replace their front brakes or rotors. The renter would pay $90 total, the host keeps $76.50, and BayShare collects $13.50 in service fees. The optional host protection tier gives frequent hosts higher equipment damage coverage, priority search placement, and automated tool-inventory checklists for a flat monthly fee.

## 2. Where IT creates value

Operations and service delivery: Instead of back-and-forth phone calls or marketplace messages to check if a garage is open, live calendar availability and automated booking confirmation cut scheduling friction down to seconds.

Distribution Channels & Data: Aggregating scattered private garages and idle independent shop bays into one searchable, filterable storefront gives hosts reach they couldn't get alone, while standardized digital check-in/check-out photo logs reduce disputes over tool damage or bay cleanup.

When looking at Porter's Value Chain, BayShare creates value in both primary and support activities. For primary, it upgrades Operations through automated scheduling, digital safety waivers, and instant booking confirmations, and strengthens Marketing and Sales by giving independent hosts a targeted distribution channel they could never build on their own. On the support side, Technology Development and aggregated booking data help hosts price peak weekend hours accurately and see which tools—like torque wrenches, spring compressors, or scan tools—drive the highest repeat bookings.

## 3. Network effects

The market type is a two-sided local marketplace. DIY car owners on one side, and garage/lift bay hosts on the other 

Extra value comes from cross-side and geographic. More local bays in a given city make shorter drive distance for drivers, specific equipment such as a two-post lift. Open Saturday slots too. Steady driver bookings give hosts reliable income to justify living in their space. 
Same-side competition could exist too if too many hosts crowd one neighbourhood or area without enough drivers.

Launching in one city or metro zone at a time, rather than nationwide, could solve the cold start problem. They could recruit 10 to 15 anchor hosts, such as local car club members and small shops with open weekend bays before opening bookings. From there, they could then partner with local enthusiasts, discover meets so that both sides know each other exists and is active from day one. 

My prototype shows this in my local bay density control on the main page. It simulates moving from 2 to 15 bays in an area and shows drive distance dropping while instant weekend slot availability rises. 

A key challenge in these two-sided marketplaces is multi-homing, where hosts also post their spaces on free online classifieds to avoid platform fees. BayShare reduces multi-homing by putting everything in one place for the customer. Bundling automated calendar sync, verified renter profiles, and per-booking liability coverage that informal classifieds cannot match. A local density reaches a tipping point where most drivers can reach an equipped bay in under 15 minutes; repeat usage rises naturally and makes it harder for hosts to leave.

## 4. Can it be copied? (the moat question)

It is true. Anyone could easily clone the BayShare website in a weekend with AI. The website itself is not a moat. 

BayShare is valuable and rare through verified local garage hosts with two-post lifts. They have specialty tools and are willing to rent spaces by the hour. They are also hard to come by in dense residential areas such as cities. 

It is hard to imitate, as trust and safety history take time to build. The work that goes into safety inspections, verified equipment, repeat reviews, and reputability and word of mouth in local car clubs can't be easily generated with code. 

It is organized to capture value by combining standardized digital check-in and out photo logs, hourly insurance/waivers and instant calendar sync turns scattered private garages into a reliable booking network online.

A well-funded competitor would have to recruit and vet hosts city by city and subsidize early bookings for 6-12 months. This can help overcome local network density. Over time, data such as peak weekend demand and switching costs, BayShare's local brand trust gets stronger. 

Looking directly at the VRIN framework (Valuable, Rare, Imperfectly Imitable, Non-substitutable), BayShare's core resources are valuable because as they save DIYers hundreds of dollars in shop labor while turning idle garage space into real income. It is also rare because residential bays with commercial-grade lifts are scarce in dense neighborhoods. They are imperfectly imitable due to path dependency-safety records, verified host inspections, and neighborhood reputation. It is built around one booking at a time and cannot be rushed just by writing code. For a renter who needs a lift and specialty tools for a four-hour suspension job, the service is also non-substitutable compared to working on jack stands in an apartment parking lot.

At the same time, it is important to recognize where BayShare's moat has limitations. Switching costs for a casual renter who only books twice a year remain fairly low, and an established auto-parts retailer or shop-management software provider could try to copy the model using its existing customer list. BayShare's defense is locking in the best local hosts early so any latecomer faces an empty map.

## 5. Cloud and operations

Saas: user authentication, ID verification, payment processing, and host payouts. Mapping/distance search and automated SMS and/or email booking reminders. 

PaaS: managed cloud database to Real Bay calendars, bookings, and inspection photos, plus cloud hosting/storage for the web app and check-in images. 

The risks of relying on cloud vendors are API price hikes, especially in map lookups or payment fees. Squeezing BayShares 15% take rate, an outage on a weekend morning stops active garage check-ins, and deep integration with one authentication or payment provider creates vendor lock-in if you ever need to switch. 

Alongside SaaS and PaaS, BayShare would also rely on IaaS object storage (such as cloud storage buckets) to store high-resolution check-in and check-out photos of bays and tools without slowing down the main database. To reduce vendor lock-in, the platform should be built on a standard relational database (like PostgreSQL) and use clean API wrappers around payment and mapping services so BayShare could switch providers if pricing changes.

## 6. Risks and ethics

A renter misusing a lift or not securing their vehicle properly could cause serious injury or wreck expensive equipment. A mitigation could be mandatory lift safety acknowledgement before booking, host equipment verification, photo check-in/out logs and per-booking liability/damage coverage. This damage coverage could exist in the form of a fee that Bay users could pay out as insurance. 

Listing residential garages could reveal where high-value tools and project cars are stored. Could use an approach where only approximate neighborhoods are shown on the map, and reveal the exact street address only after a verified booking is paid for and confirmed.

Beyond physical safety and address privacy, BayShare also needs strong data minimization practices when verifying driver's licenses or IDs for liability coverage—collecting only what is required to confirm identity and deleting raw ID images once verified rather than storing sensitive documents long-term. Finally, to prevent neighborhood friction and noise complaints in residential areas, hosts would set clear quiet-hour rules restricting loud pneumatic air tools to daytime hours.

AI tools used: GitHub Copilot to generate and refine plain HTML/CSS?JS Prototype and Gemini to brainstorm structure and review drafts against the rubric. 