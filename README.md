---
title: Token Link
---

## Purpose
An Apollo Link to setting auth token to headers before making a request.

## Installation

`npm install apollo-link-token --save`

or Yarn
`yarn add apollo-link-token`

## Usage
```js
import { TokenLink } from "apollo-link-token";

const link = new TokenLink({
  getValidTokenAsync: async () => {
    return null;
  },
});
```

## Options
- `getValidTokenAsync`: a async function call in every request to receving token from storage. You can do some stuff: check expires and refresh if need.

