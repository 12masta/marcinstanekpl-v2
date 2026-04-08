const path = require(`path`)

module.exports = {
  // Gatsby 5 default is "always"; set explicitly so URLs stay predictable across upgrades.
  trailingSlash: `always`,
  siteMetadata: {
    title: `marcinstanek.pl`,
    author: {
      name: `Marcin Stanek`,
      summary: `who lives and works in Poland building useful things.`,
    },
    description: `
        Independent QA contractor (B2B). Test automation, .NET/APIs, CI/CD - and pipeline workflows that clarify what to test before execution. Based in Poland.`,
    siteUrl: `https://marcinstanek.pl`,
    social: {
      twitter: `MarcinstanekP`,
    },
    og: {
      ogImage: "/ogImage.jpg",
      ogImageType: "image/jpg",
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogOgImages`,
        path: `${__dirname}/static/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    ...(process.env.GATSBY_GA_MEASUREMENT_ID
      ? [
          {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              trackingIds: [process.env.GATSBY_GA_MEASUREMENT_ID],
              gtagConfig: {
                anonymize_ip: true,
              },
              pluginConfig: {
                head: true,
                respectDNT: true,
              },
            },
          },
        ]
      : []),
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { frontmatter: { date: DESC } },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "marcinstanek.pl blog",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Marcin Stanek Blog`,
        short_name: `marcinstanek.pl`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/ms-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    "gatsby-plugin-slug",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/",
        excludes: [
          "/privacy-policy/",
          "/dziekuje/",
          "/selenium-zadanie-rekrutacyjne-dziekuje/",
        ],
        query: `
                {
                  site {
                    siteMetadata {
                      siteUrl
                    }
                  }
                  allSitePage {
                    nodes {
                      path
                    }
                  }
                  allMarkdownRemark {
                    nodes {
                      frontmatter {
                        date
                      },
                      fields {
                        slug
                      }
                    }
                  }
                }`,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMarkdownRemark: { nodes: allPosts },
        }) => {
          const pathToDateMap = {}

          allPosts.map(post => {
            pathToDateMap[post.fields.slug] = { date: post.frontmatter.date }
          })

          const pages = allPages.map(page => {
            return { ...page, ...pathToDateMap[page.path] }
          })

          return pages
        },
        serialize: ({ path, date }) => {
          let entry = {
            url: path,
            changefreq: date ? `weekly` : `monthly`,
            priority: 0.5,
          }

          if (date) {
            entry.priority = 0.7
            entry.lastmod = date
          }

          return entry
        },
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        purgeCSSOptions: {
          content: [
            path.join(__dirname, `src/**/*.{js,jsx,ts,tsx}`),
            path.join(__dirname, `content/**/*.markdown`),
          ],
          safelist: {
            standard: [
              `html`,
              `body`,
              `collapse`,
              `collapsing`,
              `show`,
              `collapsed`,
              `active`,
            ],
            deep: [
              /^accordion/,
              /^navbar-/,
              /^collapse/,
              /^modal-/,
              /^tooltip/,
              /^popover/,
              /^offcanvas/,
              /^dropdown/,
              /^btn/,
              /^alert/,
              /^nav-/,
              /^fade/,
              /^ratio/,
              /^object-fit/,
              /^icon-link/,
              /^border-secondary-subtle/,
              /^text-bg-/,
              /^bg-body/,
              /^link-underline/,
            ],
            greedy: [/^gatsby-/],
          },
        },
      },
    },
  ],
}
