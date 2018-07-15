Hi Rhian,

I hope i do not confusing you completely ==> a great SOOORRRY!!!!

### Solidity review
yes please ...
### Mocha/Chai questions
here i invesigated further on and wrote additional test cases; I'm currently thinking/hoping that it has something to do with java script and numbers;

* 01_fixedsupplytokenORIGINAL.js

is the test-case where i first saw my problem and tagged the places with QUESTION-1 and QUESTION-2; the test is completely runnable in my environment;

then i thought it is a good idea to split the test in two 

* one using pure decimals (i mean the complete numbers) and use computed before-/after-amounts for assertions and not entering number-literals

* and the other using the token.decimal value (i mean the amount==token*(10**token.decimal)) and use computed before-/after-amounts for assertions and not entering number-literals

this resulted in the tests

* 02_fixedsupplytokenUsingPureDecimals.js
* 03_fixedsupplytokenUsingToken.js

both of them are completely successfully

after that i thought: "ok 02/03 are runnable then i can mix them; all steps are computed and therefore i can mix at least the transfer-stuff"

here i came out with the successfully test

* 04_fixedsupplytokenMixedOK.js

this was also successfully

then i simply switched in

* 05_fixedsupplytokenMixedNOK.js

the sequence of transfers from token/decimal to decimal/token; this resulted in an error and therefore in my QUESTION-3

```
Contract: fixedSupplyTokenMixedNOK
       it should transfer the correct number of tokens (using token.decimal computation):

      Bob has incorrect balance
      + expected - actual

      -50.000000000004995
      +50.000000000005 
```

hope i have described it understandable (at least halfway);

As a learning from my side
1. it makes sence to create decimal and token based tests
2. never mix them