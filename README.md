# HackerRank Test Runner

[HackerRank](https://www.hackerrank.com/) encourages you to write code in your
own editor.  They provide sample test cases for you to use.  They do _not_
provide an easy way for you to process the data while you develop.

This is a test runner designed to help with this process, providing immediate
feedback while completing challenges.


## Usage



Assuming you've downloaded the test cases from HackerRank, exported the .zip,
and you have a structure like this


```
▾ 2d-array/
  ▾ tests/
    ▾ input/
        input00.txt
        input01.txt
        input03.txt
        input08.txt
    ▾ output/
        output00.txt
        output01.txt
        output03.txt
        output08.txt
    solution.js
```

...you can run each test with

```sh
./node_modules/.bin/hrtr 2d-array/solution.js
# or
yarn hrtr 2d-array/solution.js
```

