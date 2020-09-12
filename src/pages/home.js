import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

import Content from "../components/content";
import { Navbar } from "../components/navbar";
import { Selector } from "../components/selector";
import SearchBar from "material-ui-search-bar";
import MasonaryGrid from "../components/masonryGrid";
import { makeStyles } from "@material-ui/core/styles";

import {
  GET_TAGS,
  GET_APPROVED_POST,
  SEARCH_POSTS,
  SEARCH_BY_TEXT_AND_TAGS,
  SEARCH_POST_BY_TAG,
} from "../gql/queryData";
import useImperativeQuery from "../utils/imperativeQuery";

import { sortBy } from "../utils/utils";
import { useQuery } from "@apollo/react-hooks";
import { Tagger } from "../components/tagger";

const sortByOptions = [
  { name: "Newest", value: "new" },
  { name: "Oldest", value: "old" },
  { name: "Most Liked", value: "liked" },
];

const useStyles = makeStyles((theme) => ({
  search: {
    marginLeft: "30%",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0%",
    },
    display: "flex",
    alignItems: "center",
  },
  sort: {
    marginLeft: "14%",
    padding: "10px",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0%",
    },
  },
}));

const Home = () => {
  const [postData, setPostData] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [textString, setTextString] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const classes = useStyles();

  const searchPosts = useImperativeQuery(SEARCH_POSTS);
  const searchPostsByTag = useImperativeQuery(SEARCH_POST_BY_TAG);
  const searchByTextAndTags = useImperativeQuery(SEARCH_BY_TEXT_AND_TAGS);
  const resetSearch = useImperativeQuery(GET_APPROVED_POST);
  const { data: pData, loading: ploading, error: perror } = useQuery(
    GET_APPROVED_POST
  );
  const { data: tagsData, loading: tloading, error: terror } = useQuery(
    GET_TAGS
  );

  // set tag options
  useEffect(() => {
    if (!tloading && !terror) {
      var options = [];
      tagsData.queryTag.forEach((element) => {
        options.push({ name: element["name"], value: element["name"] });
      });
      // sort alphabetically
      options.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setTagOptions(options);
    }
  }, [tagsData, tloading, terror]);

  // set initial data
  useEffect(() => {
    if (!ploading && !perror) {
      // sort the pData by first option of the sorter
      setPostData(sortBy(pData.queryPost, sortByOptions[0]["value"]));
    }
  }, [pData, ploading, perror]);

  //  triggers the best fitting query based on search parameter
  const search = async (textString = "", tag = "") => {
    // No input defined.
    if ((tag === "") & (textString === "")) {
      const { data } = await resetSearch();
      setPostData(data);
      return;
    }
    // Search by text
    if (tag === "") {
      const { data } = await searchPosts({
        text: textString,
      });
      setPostData(data);
      return;
    }
    // Search by tags
    if (textString === "") {
      const { data } = await searchPostsByTag({
        input: tag,
      });
      let queryPost = [];
      data.queryTag.forEach((element) => {
        queryPost.push(...element["posts"]);
      });
      setPostData(queryPost);
      return;
    }
    // search by both
    const { data } = await searchByTextAndTags({
      text: textString,
      tags: tag,
    });
    setPostData(data.queryPostByTextAndTags);
  };

  const handleClick = async () => {
    await search(textString, searchTag);
  };

  const handleChange = async (text) => {
    await search(text, searchTag);
    setTextString(text);
  };

  const SortBy = (by) => {
    const data = postData;
    setPostData(sortBy(data, by));
  };

  // used for toggling tag also
  const onChangeTag = async (tag) => {
    if (tag === searchTag) {
      setSearchTag("");
      await search(textString, "");
    } else {
      setSearchTag(tag);
      await search(textString, tag);
    }
  };

  return (
    <>
      <Navbar title="Home" color="primary" />
      <Content>
        {postData !== null && (
          <>
            <div className="homepage-container">
              <div className="homepage-sidebar">
                <Tagger
                  selected={searchTag}
                  tags={tagOptions}
                  onChange={(e) => {
                    onChangeTag(e.target.value);
                  }}
                  expand={isMobile ? false : true}
                />
              </div>

              <div className="homepage-content-container">
                <div
                  // className="homepage-search-container"
                  className={classes.search}
                >
                  <div className="searchbar-container">
                    <SearchBar
                      value={textString}
                      label="Search your joke here"
                      onChange={ async (newText) => await handleChange(newText)}
                      onRequestSearch={handleClick}
                      onCancelSearch={() => {
                        setTextString("");
                        search("", searchTag);
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className={classes.sort}>
                    <Selector
                      label={"Sort By"}
                      options={sortByOptions}
                      cb={SortBy}
                    />
                  </div>
                </div>
                <br />
                <MasonaryGrid data={postData} isApproved={true} />
              </div>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default Home;
