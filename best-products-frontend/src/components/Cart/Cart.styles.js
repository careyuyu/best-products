import styled from "styled-components";


export const Wrapper = styled.aside`
  width: 450px;
  padding: 20px;
  background: #fffbd5;

  .product_img {
    float: left;
    width:  100px;
    height: 100px;
    object-fit: scale-down;
    margin-right: 1px;
  }

  .title-section {
    maxWidth: 100px !important;
  }

  .cart-card {
    height: 125px;
    border-radius: 0.25rem;
    border: 1px solid pink;
    background-color: white
  }

  .cart-title {
    width: 120px;
  }
`;
