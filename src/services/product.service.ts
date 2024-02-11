import { PoolClient, QueryResult } from "pg";
import { pool } from "../db";
import { InternalServerError } from "../errors/InternalServerError";
import { Product, ProductVariant } from "../types/product";

const addProduct = async (productData: Product & { displayImageUrl: string }, client?: PoolClient) => {
  const { name, description, quantity, price, displayImageUrl } = productData;

  const query = {
    text: `
        INSERT INTO products (name, description, quantity, price, display_price, display_image_url, has_variants)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING product_id;
        `,
    values: [name, description, quantity, price, price, displayImageUrl, false],
  };

  let result;
  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows[0].product_id as number;
};

const addProductWithVariants = async (productData: { name: string; description: string; displayPrice: number; displayImageUrl: string }, client?: PoolClient) => {
  const { name, description, displayImageUrl, displayPrice } = productData;

  // const displayPrice = variants[defaultVariantIdx].price;

  const query = {
    text: `
      INSERT INTO products (name, description, display_price, display_image_url, has_variants)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING product_id;
      `,
    values: [name, description, displayPrice, displayImageUrl, true],
  };

  let result;
  if (client) {
    result = await client.query(query);
  } else {
    result = await pool.query(query);
  }

  return result.rows[0].product_id as number;
};

const updateProduct = async (
  product: {
    name?: string;
    description?: string;
    quantity?: number;
    price?: number;
    default_variant?: number;
    display_image_url?: string;
    has_variants?: boolean;
  },
  productId: number,
  client?: PoolClient
) => {
  let placeHolderCount = 0;

  const keys = Object.keys(product);
  const values = Object.values(product);

  const setClauses = keys.map((key, index) => `${key} = $${++placeHolderCount}`).join(", ");

  const queryText = `UPDATE PRODUCTS SET ${setClauses} WHERE product_id = $${++placeHolderCount} RETURNING *;`;

  const queryValues = [...values, productId];

  const query = {
    text: queryText,
    values: queryValues,
  };

  let queryResult: QueryResult;
  if (client) {
    queryResult = await client.query(query);
  } else {
    queryResult = await pool.query(query);
  }

  return queryResult;
};

const deleteProduct = async (productId: number) => {
  const queryText = `DELETE FROM products where product_id=$1;`;

  const query = {
    text: queryText,
    values: [productId],
  };

  const queryResult = await pool.query(query);

  return queryResult;
};

export default {
  addProduct,
  addProductWithVariants,
  updateProduct,
  deleteProduct,
};

// export const updateProduct = async (
//   product: {
//     name?: string;
//     description?: string;
//     quantity?: number;
//     price?: number;
//     default_variant?: number;
//     display_image_url?: string;
//   },
//   productId: number,
//   options: {
//     client?: PoolClient;
//     returnPrevDisplayImage?: boolean;
//   } = {
//     returnPrevDisplayImage: false,
//   }
// ) => {
//   // if options.new is false will return pre-updated data, otherwise will return updated data
//   let queryText = "";
//   const queryValues: (string | number)[] = [];

//   let placeHolderCount = 0;

//   if (options.returnPrevDisplayImage) {
//     queryText += `WITH before_update AS (
//       SELECT display_image_url FROM products WHERE product_id = $${++placeHolderCount}
//     ) `;
//     queryValues.push(productId);
//   }

//   const keys = Object.keys(product);
//   const values = Object.values(product);

//   const setClauses = keys.map((key, index) => `${key} = $${++placeHolderCount}`).join(", ");

//   queryText += `UPDATE PRODUCTS SET ${setClauses} WHERE product_id = $${++placeHolderCount} `;
//   // const queryText =
//   // const queryValues = [...values, productId];

//   queryValues.push(...values, productId);

//   if (options.returnPrevDisplayImage) {
//     queryText += `RETURNING *, (SELECT display_image_url FROM before_update) AS prev_display_image_url;`;
//   } else {
//     queryText += `RETURNING *;`;
//   }

//   console.log(queryText);
//   console.log(queryValues);

//   const query = {
//     text: queryText,
//     values: queryValues,
//   };

//   let queryResult: QueryResult;
//   if (options.client) {
//     queryResult = await options.client.query(query);
//   } else {
//     queryResult = await pool.query(query);
//   }

//   const rows = queryResult.rows;

//   return rows[0];
// };
