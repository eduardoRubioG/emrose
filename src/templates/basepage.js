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
                        <h1>{data.allWordpressPage.edges[0].node.title}</h1>
                    </div>
                    <div className="content row flex">
                        {/* This is where the user image will go */}
                        {/* {data.markdownRemark.frontmatter.image && (
                            <div className="center">
                                <div className="img">
                                    <Img
                                        fluid={
                                            data.markdownRemark.frontmatter
                                                .image.childImageSharp.fluid
                                        }
                                    />
                                </div>
                            </div> */}
                        <div
                            className="col s12 m11 l10"
                            dangerouslySetInnerHTML={{
                                __html: data.allWordpressPage.edges[0].node.content
                            }}
                        ></div>
                    </div>
                </article>
            </div>
        </Layout>
    );
}
export const query = graphql`
    query {
        allWordpressPage( filter: {title: {regex: "/About/"}} ){ 
            edges { 
                node { 
                    title
                    content
                }
            }
        }
    }
`;
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
