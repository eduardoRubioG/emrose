import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Img from "gatsby-image";
import SEO from "../components/seo";
import "../style/basepage.less";

/** 
 *      This is the ABOUT main page. Idk why it is called the basepage. We can change that later 
 * 
 */
export default function({ data }) {
    const _content = data.wpgraphql.pages.nodes[0].content;
    const _title = data.wpgraphql.pages.nodes[0].title;
    const _image = data.allWordpressWpUsers.nodes[0].simple_local_avatar.full.localFile; 
    return (
        <Layout>
            {/* <SEO
                lang="en"
                title={data.allWordpressPage.edges.node.title}
                description={data.markdownRemark.frontmatter.description}
            /> */}
            <div className="container">
                <article className="post">
                    <div className="head text-primary">
                        <h1>{ _title }</h1>
                    </div>
                    <div className="content row flex">
                        {/* This is where the user image will go */}
                        { _image && (
                            <div className="center">
                                <div className="img">
                                    <Img 
                                    fluid={_image.childImageSharp.fluid}
                                    sizes={{..._image.childImageSharp.fluid,aspectRatio:1/1}}    
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className="col s12 m11 l10"
                            dangerouslySetInnerHTML={{
                                __html: _content
                            }}
                        ></div>
                    </div>
                </article>
            </div>
        </Layout>
    );
}
// Importing: 
// About page title (which is "About") but consider changing this to page ID 
// The page content 
// Featured image, which will be the actual profile pic -- ADD THIS TO THE 
export const query = graphql`
    query {
        wpgraphql {
            pages(where: {title: "About"}) {
                nodes {
                title
                content
                }
            }
        }
        allWordpressWpUsers {
            nodes {
                simple_local_avatar {
                    full {
                        localFile {
                            childImageSharp {
                                fluid(maxWidth: 1920){
                                base64
                                aspectRatio
                                src
                                srcSet
                                tracedSVG
                                sizes
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
// export const query = graphql`
//     query {
//         allWordpressPage( filter: {title: {regex: "/About/"}} ){ 
//             edges { 
//                 node { 
//                     title
//                     content
//                 }
//             }
//         }
//     }
// `;
// export const query = graphql`
//     query($slug: String!) {
//         markdownRemark(fields: { slug: { eq: $slug } }) {
//             html
//             frontmatter {
//                 title
//                 description
//                 image {
//                     publicURL
//                     childImageSharp {
//                         fluid(maxWidth: 1920) {
//                             srcSet
//                             ...GatsbyImageSharpFluid
//                         }
//                         id
//                     }
//                 }
//             }
//         }
//     }
// `;
