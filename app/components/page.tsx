import React from "react";
import Header from "./header/header";
import Footer from "./footer/footer";
import Category from "./category/category";
import BookBox from "./bookbox/bookbox";
import Review from "./review/review";
import Seller from "./sellertopinfo/sellertopinfo";
import Seller2 from "./sellerstatus/sellerstatus";
import Chat from "./chatspace/chatspace";

const Page = () => {
  return (
    <>
      <Header />
      <Category heading="Fiction" image="/fiction.svg" />
      <br />
      <BookBox />
      <br />
      <Review />
      <br />
      <Seller />
      <br />
      <Seller2 />
      <br />
      <Chat />
      <br />
      <Footer />
    </>
  );
};

export default Page;
