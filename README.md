# ChemSaurus

A Google Docs add-on for chemical formatting, smart molecular substitution, and more, ChemSaurus is designed to make publishing painless. 

Created at [DevFest 2020](https://devfe.st/) at Columbia University by Josh Fuller, Omar Khan, and Emily Wang.

## Project Overview
### Motivation
When writing chemistry in Google Docs, the process of making formulas, structures, and names look presentable is tedious and requires using the internet to get chemical properties and behaviors and check for proper nomenclature conventions. As such, we wanted to streamline this process by clustering relevant solutions for the aforementioned issues into one robust product.

### Description
ChemSaurus allows you to dynamically convert text in Google Docs files into automatically-generated formats in accordance with current International Union of Pure and Applied Chemistry (IUPAC) naming standards. In addition to standard stylization edits (subscripting numbers indicating repeat atoms, superscripting those that indicate ionic charge, etc.), ChemSaurus also provides potential alternative representations of the input chemical, as well as replacement suggestions based on molecules with similar representations and/or attributes.

## Implementation
We set up ChemSaurus as a Google Docs [Add-On](https://developers.google.com/gsuite/add-ons/overview), writing the logic in Google's own all-purpose Docs language [Apps Script](https://developers.google.com/apps-script). Using [Flask](http://flask.pocoo.org/) and [Twilio](https://www.twilio.com/) in Python, our remote server (the VM) was able to receive an image of handwritten code and to respond accordingly to the user. The Google Vision Cloud API (specifically its [Optical Character Recognition](https://cloud.google.com/vision/docs/ocr)) was used to help with the handwriting-to-code conversion. Within the Google Cloud VM, we wrote a shell script, called every time the server received a text message, that would essentially compile the program and write the output and/or errors to a file. Upon the scripts completion, the server then sent the output or error messages back via text.

We've tested our platform across multiple mediums—including printer paper, lined paper, blackboards, and whiteboards—with promising results.

### List of Technologies Used
Google Cloud (Optical Character Recogniton and Compute Engine), Twilio API, Python, Flask, ngrok

## Example Usage

<img src="./img/test1.jpg" height=700/> <img src="./img/test2.jpg" height=700/> 
<img src="./img/test3.jpg" height=700/> <img src="./img/test4.jpg" height=700/> 

#### Error feedback to help debug:
<img src="./img/test5.jpg" height=300/> <img src="./img/test6.jpg" width=700/> 

## Future Visions
* Expand the possible code to more than just C. First steps would probably be Python and Java, which are among the most popular programming languages today.

* Look at ways to improve the accuracy of the machine learning text to code algorithm. Currently, we've coded some basic algorithms that correct simple compiler mistakes (missing semicolons for example). But the Google Cloud OCR tool is trained on English grammar and vocabulary, which is less accurate than training a model on code from the ground up. There are also a number of [research papers](https://arxiv.org/pdf/1801.10467.pdf) that investigate the user of deep learning to automatically fix syntax errors in code.

## Thank You
We'd like to thank the sponsors of DevFest 2019 for their products and support during this hackathon. Specifically, we'd like to thank Google for providing us hackers with $50 Cloud Platform vouchers and Twilio for providing a free upgrade to their premium plan.
