📢 Use this project, [contribute](https://github.com/brunorodmoreira/daily-pack) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Jamieson Daily-Pack

You can check out this example of composable commerce [here](https://www.vtexb2c.com/daily-pack).

## Objective

Headless commerce is becoming a trend in the retail software market, however it misleads it's audience from their original pursuit: how to easily build digital experiences without any compromise on behalf of their legacy systems. A full headless implementation requires an abundance of resources for a successful implementation. Retailers are not in the market to create a new product shelf. The use case described in this document aims at showcase how we perceive headless not as a cannon ball but as a tool for retailers to use in specific situations, where there is a possibility for them to create value add. Meaning that headless is a frame to be used only to achieve specific outcomes. Allowing for headless front-end is one of the fundamental requirements for the composable commerce suite, but it is not it's definition.

## Challenge

Jamieson is a supplement manufacturer and retailer. It is testing a new revenue stream based on subscriptions where a customer can create its own pill-pack. However each country has a set of daily dosage limits per chemical compound.  In Canada there is a limit of 350 mg of magnesium per male adult per day, whereas in the US this is only 300 mg per day. 

Currently Jamieson is testing this system in their Shopify store, where they have hardcoded the daily dosage limits in a script being served when user access the subscription landing page. To allow for recurrent orders they have also setup a new checkout, implemented in a subdomain. This is a checkout-as-a-service platform for subscription orders. 

**1 - The HC script includes the limits for each compound for each country making changes and updates error prone.**

**2 - Each Health Organization establishes limits by gender and age. The supplement market is evolving to make personalized products, meaning that the business rules must evolve to account for customer profile.**

**3 - The commerce engine does not support a mix of subscription and stand-alone products.**

## Desired Outcome

A typical e-commerce team has a marketing and merchandising division who is responsible for product curation and customer engagement with the store. This team should have freedom to test different strategies related to the subscription MVP. This means that this team wishes to make style modifications without constraints of business rules, however these two are currently meshed together in a single front-end script.

Merchandising team should also have independency when making updates on the limits established by health organizations, or if Jamieson decides to open a new country. 

Development team in charge of adding new rules should not have to worry if their changes will have a negative effect on the marketing team. From this desired future we derive three core outcomes:

1. Easily change Front-End design
2. Add new countries or update existing limits
3. Add new business rules

# Architecture

There will be a specific application for each core experience. We assume that the store already has a store-theme app that uses pre-existing components in order to make up for the site navigation. This app will be responsible of rendering the landing page as if it was a page like any other. 

The product shelves in this page will have a button that adds a pill to the package. The package is a component that acts as a short-term storage. This package can be considered a dynamic bundle. The customer will choose which components (pills) are to be part of the bundle (pack). Once it finishes making the selection the "subscribe" button will add the bundle to the cart including the chosen components. 

By leveraging the Assembly Options feature the merchandising team can decide which products from the catalog can be part of this bundle. This native feature also handles minimum and maximum quantities of each component, as well as minimum and maximum products within the bundle itself. 
 
The add-to-pack button, the lateral component (list of chosen pills) as well as the subscribe button were created by the custom VTEX IO app (daily-pack@0.x) that handles the business rules. 

![Media Placeholder](https://user-images.githubusercontent.com/23402009/88384555-8b159700-cda4-11ea-9736-5b57b82cd464.png)

A custom VTEX IO app can export react apps that other applications can import and re-use without having to implement any new code.


![Media Placeholder](https://user-images.githubusercontent.com/23402009/88384623-a7193880-cda4-11ea-890d-0f4c50cb56c1.png)

Since all of the necessary coding to create these three components was done inside the business rules app (daily-pack@0.x), the store-theme just needs to declare this 3rd party app as a dependency.

![Media Placeholder](https://user-images.githubusercontent.com/23402009/88384955-535b1f00-cda5-11ea-8eef-dfa4c7cc3023.png)

By making the entire custom application become a "button" the marketing team can take control of the front-end. This reduces dependency between teams. While the developer works on his own app the marketing team can adjust the css and run their A/B tests.

Through a Master Data application an analyst from the Merchandising Team will be able to easily update limits on a compound, as well as add new products in the catalog.

![Media Placeholder](https://user-images.githubusercontent.com/23402009/88384674-c31cda00-cda4-11ea-955d-890abf3bbe50.png)

The Master Data application will store the limits, whereas the catalog will store information on each product, giving full autonomy for this team to progress on their project without having to depend on technical teams to make changes on a hard coded script.

![Media Placeholder](https://user-images.githubusercontent.com/23402009/88384585-99fc4980-cda4-11ea-9677-331da6b242ad.png)


<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

