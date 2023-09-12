export const environment = {
    production: false,
    env:{
      backend:{
        protocol:"http",
        host:"localhost",
        port:"8080",
        get_tool_data_service:"indexedtools/getTools",
        search_term_data_service:"indexedtools/searchTerm",
        browse_tools_path_service:"indexedtools/browseToolPaths",
        browse_tools_service:"indexedtools/getBrowsedTools",
        get_tool_details:"indexedtools/getTool",
        contact_service:"communication/contact",
        technology_usage_service:"visuals/getMostUsedTechnologies",
        country_tools_service:"visuals/getToolsPerCountry",
        get_country_tools:"visuals/getToolsUsedInCountry",
        data_counters_service:"visuals/getDataCounters",
        get_human_tool_interactions_service:"visuals/getToolsPerHumanInteraction",
        recaptcha_key:"",
        use_analytics:false,
        use_recaptcha:false,
        analytics_get_filter_indices_usage: 'analytics/getFilterIndicesUsage',
        analytics_get_filter_value_frequency: 'analytics/getFilterValueFrequency',
        analytics_get_search_terms: 'analytics/getSearchTerms',
        analytics_get_tool_visits: 'analytics/getToolVisits',
        analytics_get_browsed_app_scenarios: 'analytics/getBrowsedAppScenarios',
        analytics_get_browsed_filter_path: 'analytics/getBrowsedFilterPath',
        analytics_get_most_popular_value_in_filters: 'analytics/getMostPopularValueInFilters',
        analytics_get_visitor_countries: 'analytics/getVisitorCountries',
        analytics_get_tool_relation_graph: 'analytics/getToolRelationGraph',
        analytics_get_top_k_search_terms: "analytics/getTopKSearchTerms"
      },
      ga:{
          global_site_tag:[
              {
                  "code":"window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());        gtag('config', '');"
              },
              {
              async:true,
              src :"https://www.googletagmanager.com/gtag/js?id="
              }
          ],
          header:"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','');",
          body:"<iframe src=\"https://www.googletagmanager.com/ns.html?id=\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>"
      },
      tool_details:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628"
          },
          kbt:{
              link:"/kbt"
          },
          search_url:"/search",
          category_colors: {
            "Rural Areas": "#B67400",
            "Agriculture": "#9CB600",
            "Forestry": "#42B600"
          }
      },
      breadcrumb:{
              items:{
                  home:{
                      name:"Home",
                      link:"/kbt"
                  },
                  search:{
                      name:"Search",
                      link:"/kbt/search"
                  },
                  privacy:{
                      name:"Privacy Policy",
                      link:"/kbt/privacy"
                  },
                  about:{
                      name:"About",
                      link:"/kbt/about"
                  },
                  contact:{
                      name:"Contact Us",
                      link:"/kbt/contact"
                  },
                  detailed:{
                      name:"Tool Details",
                      link:""
                  },
                  browse:{
                      name:"Browse by Categories",
                      link:"/kbt/browse"
                  },
                  dashboard:{
                    name:"Dashboard",
                    link:"/kbt/dashboard"
                  }
              },
              paths:{
                  search:["home"],
                  privacy:["home"],
                  about:["home"],
                  contact:["home"],
                  detailed:["home","search"],
                  browse:["home"],
                  dashboard:["home"]
              }
      },
      navbar:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628"
          },
          kbt:{
              link:"/kbt"
          },
          items:[
            {
              name:"Dashboard",
              link:"/kbt/dashboard"
            },
            {
             name:"Search",
             link:"/kbt/search"
            },
            {
              name:"Browse",
              link:"/kbt/browse"
            }
        ]
      },
      analytics: {
        filter_indices_usage: {
          fill_color: '#3C9D9B'
        },
        filter_value_frequency: {
          fill_colors:
            [
              '#2a6e6d',
              '#368d8c',
              '#63b1af',
              '#8ac4c3',
              '#b1d8d7',
              '#d8ebeb',
              '#b1d8d7',
              '#8ac4c3',
              '#63b1af',
              '#368d8c'
            ]
        },
        search_terms: {
        },
        browsed_app_scenarios: {
          fill_color: '#3C9D9B'
        },
        browsed_filter_path: {
          fill_color: '#3C9D9B'
        },
        most_popular_value_in_filters: {
          domains: {
            icon: 'assets/domain.svg'
          },
          countries: {
            icon: 'assets/countries.svg'
          },
          digitalTechnologies: {
            icon: 'assets/digital_technologies.svg'
          },
          humanToolInteractions: {
            icon: 'assets/human_tool_interactions.svg'
          },
          physicalDigitalConnections: {
            icon: 'assets/physical_digital_connections.svg'
          }
        },
        visitor_countries: {
          title: '',
          subtitle: '',
          series: {name: 'Users Per Country'},
          states: {hover: {color: '#BADA55'}},
          height: 438
        },
        tool_relation_graph: {
          radius: {
            Domain: 45,
            Subdomain: 33,
            ApplicationScenario: 22,
            Tool: 9,
            DigitalTechnology: 22
          },
          nodeOpacity: {
            Domain: 1,
            Subdomain: 0.92,
            ApplicationScenario: 0.82,
            Tool: 0.7,
            DigitalTechnology: 0.82
          },
          fontSize: {
            Domain: '45px',
            Subdomain: '30px',
            ApplicationScenario: '20px',
            Tool: '0',
            DigitalTechnology: '20px'
          },
          edgeWidth: {
            Domain: 7.5,
            Subdomain: 4.5,
            ApplicationScenario: 1.0,
            Tool: 0.1,
            DigitalTechnology: 1.0
          },
          edgeOpacity: {
            Domain: 1,
            Subdomain: 0.6,
            ApplicationScenario: 0.3,
            Tool: 0.1,
            DigitalTechnology: 0.3
          },
          group: {
            Domain: 0,
            Subdomain: 1,
            ApplicationScenario: 2,
            Tool: 3,
            DigitalTechnology: 4
          },
          nodeStrength: -40,
          nodeStrengthWithDigitalTechnologies: -50,
          linkStrength: 0.01,
          linkStrengthWithDigitalTechnologies: 0.01,
          height: {
            'Agriculture': {
              notShowingDigitalTechnologies: 2000,
              showingDigitalTechnologies: 2000
            },
            'Forestry': {
              notShowingDigitalTechnologies: 1300,
              showingDigitalTechnologies: 1300
            },
            'Rural Areas': {
              notShowingDigitalTechnologies: 1800,
              showingDigitalTechnologies: 1800
            }
          },
          width: {
            'Agriculture': 2000,
            'Forestry': 2000,
            'Rural Areas': 2000
          },
          decayParameter: {
            notShowingDigitalTechnologies: 110,
            showingDigitalTechnologies: 110
          }
        }
      },
      visuals:{
        rows: [[[3, 4, 6, 7, 5]], [[9]], [[0], [1]], [[8]], [[2]]],
        charts:[{
            type:"barchart",
            data_service:"technology_usage_service",
            id:"tech_bar",
            fill_color:"#d04a35"
        },
        {
            type:"barchart",
            data_service:"get_human_tool_interactions_service",
            id:"tech_bar2",
            fill_color:"#dddddd"
        },
        {
            type:"attribute-geomap",
            data_service:"country_tools_service",
            id:"country_map",
            title:"",
            subtitle:"",
            series:{name:"Tools Per Country"},
            states:{hover:{color:"#BADA55"}}
        },
        {
            type:"counter",
            data_service:"data_counters_service",
            id:"tools_counter",
            attribute:"tools",
            shared:true
        },
        {
            type:"counter",
            data_service:"data_counters_service",
            id:"countries_counter",
            attribute:"countries",
            shared:true
        },
        {
            type:"counter",
            data_service:"data_counters_service",
            id:"appscenarios_counter",
            attribute:"applicationScenarios",
            shared:true
        },
        {
            type:"counter",
            data_service:"data_counters_service",
            id:"domains_counter",
            attribute:"domains",
            shared:true
        },
        {
            type:"counter",
            data_service:"data_counters_service",
            id:"subdomains_counter",
            attribute:"subdomains",
            shared:true
        },
        {
          type: "most-visited-dts",
          data_service: "analytics_get_tool_visits",
          data_service_parameters: "topK=5",
        }
    ]
    },
      browse:{
          colors:{
              "domain": "#206A5D",
              "digital tool technologies": "#00AF91",
              "interactions between human and tool": "#FFCC29",
              "connection between digital and physical objects": "#F58634",
              "rural areas": "#81B214",
              "agriculture": "#D3D6C1",
              "forestry": "#877131"
          },
          terminal:{
              color:{
                  bg:"#D9D9D9",
                  description:"#9FA5AA",
                  title:"#007628"
              },
              link:"/tool"
          }
      },
      search_page:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628"
          },
          kbt:{
              link:"/kbt"
          },
          img_settings:{
              w:20,
              h:25
          },
          tool_detailed_url:"/tool",
          imgs:[
              {
                  id:"Rural Areas",
                  file:"assets/rural areas.svg"
              },
              {
                  id:"Agriculture",
                  file:"assets/agriculture.svg"
              },
              {
                  id:"Forestry",
                  file:"assets/forestry.svg"
              }
          ]
      },
      landing_page:{
          logo:{
              file:"assets/gnomee_logo.png",
              w:250,
              h:100
          },
          colors:{
              welcome:"#007628",
              background:"#EAEAEA",
              title:"#6F007A",
              description:"#007628" ,
              links:"#007628",
              "search-placeholder":"white"
          },
          text:{
              title:"Welcome to​ The DESIRA Knowledge Base Tool",
              description:"The inventory of potential Digital Game Changers in Rural Areas",
              searchPlaceholder:"Search for Digital Game Changers Digital Tools"
          },
          font:{
              title:"2.5em"
          },
          submit:{
              url:"/search"
          },
          links:[
            {
                text:"Dashboard",
                url:"/dashboard"},
              {
                text:"Advanced Search",
                url:"/search"},
              { text:"Browse by Categories",
                  url:"/browse"}
          ]

      },
      privacy:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628",
              background:"#c1dec8"
          },
          kbt:{
              link:"/kbt"
          },
          img_settings:{
              w:20,
              h:25
          },
          toolName:"KBT"
      },
      about:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628",
              background:"#c1dec8"
          },
          kbt:{
              link:"/kbt"
          },
          img_settings:{
              w:20,
              h:25
          },
          toolName:"KBT"
      },
      contact:{
          logo:"assets/kbt-mini-logo.png",
          colors:{
              title:"#007628",
              background:"#c1dec8"
          },
          kbt:{
              link:"/kbt"
          },
          img_settings:{
              w:20,
              h:25
          },
          toolName:"KBT"
      },
      footer:{
          eu:{
              file:"assets/europe.jpg",
              w:50,
              h:40,
              link:""
          },
          desira:{
              file:"assets/Logo Desira_1.png",
              w:150,
              h:50,
              link:"https://desira2020.eu/"
          },
          athena:{
              file:"assets/athena_cropped.png",
              w:160,
              h:40,
              link:"https://www.imsi.athenarc.gr/en"
          },
          text:{
              funding:"This work is funded by the European Commission under the Horizon 2020 European research infrastructures grant agreement no. 818194",
              privacy:{"text":"Privacy Policy", "link":"/kbt/privacy"},
              about:{ "text" : "About", "link": "/kbt/about"},
              contact:{ "text" : "Contact Us", "link": "/kbt/contact"},
              cookies:"Manage Cookies"
          },
          font:{
              size:"0.7em"
          }
      },
      "dynamic-modal":{
              logo:{
                  file:"assets/kbt-full-logo.png"
              }
      },
      "cookie-banner":{
          cookie_object_name:"kbt",
          notice_text:"This website uses cookies for analytics, improving your on-line experience and enabling third party features. If you agree, choose \"Accept all\", otherwise manage your preferences in \"Cookie settings\".",
          cookie_modal:{
              logo:{
                  file:"assets/gnomee_logo.png",
                  w:150,
                  h:45
              },
              title:"How KBT uses cookies",
              content:["Cookies are small pieces of data that are stored by a browser on a computer's hard drive, mobile phone or any other device used to access the internet. DESIRA uses cookies that are absolutely necessary for the operation of the website.",  "In addition, with your consent DESIRA may collect analytical/ performance Cookies. These cookies allow to count the number of visitors and to improve website experience. They collect aggregated information (i.e. country, browser type, time and duration of website visit, etc.). With respect to analytical/ performance Cookies, DESIRA uses Google Analytics (Google Ireland Limited) that enable it to optimize website experience based on the specific user characteristics. For more information on the terms of personal data processing please review <a href='https://policies.google.com/privacy'>Google’s privacy policy</a>.","You may change your cookie settings at any time to accept or refuse these analytics technologies.","This page uses cookies to improve website experience. With your consent, we may collect cookies for statistical purposes. For more information see our privacy statement available <a href='/kbt/privacy'>here.</a>"],
              cookie_settings:{
                  cookie_categories:[
                      {
                          name:"Strictly necessary / Basic Cookies",
                          description:"Strictly necessary cookies are essential for the running of the website; they are also essential for you to browse the website and use its features. ",
                          always_enabled:true,
                          details:{},
                          code:"sess",
                          default_value:true,
                          plugin:"session"
                      },
                      {
                          name:"Analytical/Performance Cookies.",
                          description:"These cookies allow us to count the number of visitors and to improve website experience. These cookies collect aggregated information (i.e. country, browser type, time and duration of website visit, etc.) ",
                          always_enabled:false,
                          details:{},
                          code:"ga",
                          default_value:false,
                          plugin:"ga"
                      }
                  ]
              }
          }
      },
      "user-management":{
        "cookie-key":"gnomee-auth"
    }
  }
  };
