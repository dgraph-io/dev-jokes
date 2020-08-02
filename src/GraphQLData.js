import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation addUser($user: AddUserInput!){
        addUser(input: [$user]){
            user{
                username
                name
            }
        }
    }
`;

export const ADD_POST = gql`
    mutation addPost($post: [AddPostInput!]!){
            addPost(input: $post){
                post{
                    text
                    createdby{
                        username
                    } 
                    tags{
                        name
                    }
            }
        }
    }
`;

//Schema
// type User{
//     username: String! @id
//     name: String
//     posts: [Post]
//   }
  
//   type Tag{
//     name: String! @search(by: [term])
//     posts: [Post] @hasInverse(field: tags)
//   }
  
//   type Post{
//     id: ID!
//     text: String @search(by: [fulltext])
//     tags: [Tag]
//     createdby: User!
//     timeStamp: DateTime @search
//   }