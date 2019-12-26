const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `basepages` });
        createNodeField({
            node,
            name: `slug`,
            value: slug
        });
    }
};

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return graphql(`
        {
            blog: allMarkdownRemark(
                filter: { fileAbsolutePath: { regex: "/blog/" } }
            ) {
                edges {
                    node {
                        frontmatter {
                            template
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
            portfolio: allMarkdownRemark(
                filter: { fileAbsolutePath: { regex: "/portfolio/" } }
            ) {
                edges {
                    node {
                        frontmatter {
                            template
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
            basepages: allMarkdownRemark(
                filter: { fileAbsolutePath: { regex: "/basepages/" } }
            ) {
                edges {
                    node {
                        frontmatter {
                            template
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
            limitPost: site {
                siteMetadata {
                    blogItemsPerPage
                    portfolioItemsPerPage
                }
            }
        }
    `).then(result => {
        const blogPosts = result.data.blog.edges;

        const blogPostsPerPage =
            result.data.limitPost.siteMetadata.blogItemsPerPage;
        const numBlogPages = Math.ceil(blogPosts.length / blogPostsPerPage);

        Array.from({ length: numBlogPages }).forEach((_, i) => {
            createPage({
                path: i === 0 ? `/blog` : `/blog/${i + 1}`,
                component: path.resolve("./src/templates/blog-list.js"),
                context: {
                    limit: blogPostsPerPage,
                    skip: i * blogPostsPerPage,
                    numPages: numBlogPages,
                    currentPage: i + 1
                }
            });
        });

        const PortfolioItems = result.data.portfolio.edges;
        const PortfolioItemsPerPage =
            result.data.limitPost.siteMetadata.portfolioItemsPerPage;
        const numPortfolioItems = Math.ceil(
            PortfolioItems.length / PortfolioItemsPerPage
        );

        Array.from({ length: numPortfolioItems }).forEach((_, i) => {
            createPage({
                path: i === 0 ? `/portfolio` : `/portfolio/${i + 1}`,
                component: path.resolve("./src/templates/portfolio-list.js"),
                context: {
                    limit: blogPostsPerPage,
                    skip: i * blogPostsPerPage,
                    numPages: numPortfolioItems,
                    currentPage: i + 1
                }
            });
        });

        result.data.blog.edges.forEach(({ node }) => {
            let template =
                node.frontmatter.template === undefined
                    ? "blog"
                    : node.frontmatter.template;
            createPage({
                path: node.fields.slug,
                component: path.resolve("./src/templates/" + template + ".js"),
                context: {
                    slug: node.fields.slug
                }
            });
        });

        result.data.portfolio.edges.forEach(({ node }) => {
            let template =
                node.frontmatter.template === undefined
                    ? "portfolio"
                    : node.frontmatter.template;
            createPage({
                path: node.fields.slug,
                component: path.resolve("./src/templates/" + template + ".js"),
                context: {
                    slug: node.fields.slug
                }
            });
        });

        result.data.basepages.edges.forEach(({ node }) => {
            let template =
                node.frontmatter.template === undefined
                    ? "basepage"
                    : node.frontmatter.template;
            createPage({
                path: node.fields.slug,
                component: path.resolve("./src/templates/" + template + ".js"),
                context: {
                    slug: node.fields.slug
                }
            });
        });
    });
};

// exports.createResolvers = ({
//     actions,
//     cache,
//     createNodeId,
//     createResolvers,
//     getNode,
//     store,
//     reporter
//   }) => {
//     const { createNode, touchNode } = actions;
  
//     // Add all media libary images from wordpress so they can be queried by
//     // childImageSharp to take advantage of Gatsby image processing 
//     createResolvers({
//       WPGraphQL_MediaItem: {
//         imageFile: {
//           type: `File`,
//           async resolve(source, args, context, info) {
//             if (source.sourceUrl) {
//               let fileNodeID;
//               let fileNode;
//               let sourceModified;
  
//               // Set the file cacheID, get it (if it has already been set)
//               const mediaDataCacheKey = `wordpress-media-${source.mediaItemId}`;
//               const cacheMediaData = await cache.get(mediaDataCacheKey);
  
//               if (source.modified) {
//                 sourceModified = source.modified;
//               }
  
//               // If we have cached media data and it wasn't modified, reuse
//               // previously created file node to not try to redownload
//               if (cacheMediaData && sourceModified === cacheMediaData.modified) {
//                 fileNode = getNode(cacheMediaData.fileNodeID);
  
//                 // check if node still exists in cache
//                 // it could be removed if image was made private
//                 if (fileNode) {
//                   fileNodeID = cacheMediaData.fileNodeID;
//                   touchNode({
//                     nodeId: fileNodeID
//                   });
//                 }
//               }
  
//               // If we don't have cached data, download the file
//               if (!fileNodeID) {
//                 try {
//                   // Get the filenode
//                   fileNode = await createRemoteFileNode({
//                     url: source.sourceUrl,
//                     store,
//                     cache,
//                     createNode,
//                     createNodeId,
//                     reporter
//                   });
  
//                   if (fileNode) {
//                     fileNodeID = fileNode.id;
  
//                     await cache.set(mediaDataCacheKey, {
//                       fileNodeID,
//                       modified: sourceModified
//                     });
//                   }
//                 } catch (e) {
//                   // Ignore
//                   console.log(e);
//                   return null;
//                 }
//               }
//               if (fileNode) return fileNode;
//             }
//             return null;
//           }
//         }
//       }
//     });}
