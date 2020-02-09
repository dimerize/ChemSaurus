# ChemSaurus

Run handwritten code, straight from your phone. 

Created at [DevFest 2020](https://devfe.st/) at Columbia University by Josh Fuller, Omar Khan, and Emily Wang.

## Project Overview
### Motivation
Whiteboarding, coding by hand, and reading code in the form of physical text (via textbook or otherwise) are common among programmers and CS students—but it is rather inconvenient when one wishes to compile and test such code. Thus, an easy method of converting such "physical" code into machine-parsable and runnable "real" code would be very helpful.

### Description
PicCode enables you to text a picture of handwritten C code to a special phone number, and receive the stdout output texted right back to you after the code is compiled and executed. Furthermore, the service will text meaningful debug messages if your code is can't compile or causes a runtime error. Whiteboarding often results in buggy code that is hard to verify without compiling, which is why being able to do it all on your phone is a huge plus. With our technology, you can quickly verify any handwritten code just by taking a picture!

## How We Did It
We set the entire service up on a Google Cloud [Compute Engine](https://cloud.google.com/compute/) (a virtual machine, or VM), so it's always running in the cloud. Using [Flask](http://flask.pocoo.org/) and [Twilio](https://www.twilio.com/) in Python, our remote server (the VM) was able to receive an image of handwritten code and to respond accordingly to the user. The Google Vision Cloud API (specifically its [Optical Character Recognition](https://cloud.google.com/vision/docs/ocr)) was used to help with the handwriting-to-code conversion. Within the Google Cloud VM, we wrote a shell script, called every time the server received a text message, that would essentially compile the program and write the output and/or errors to a file. Upon the scripts completion, the server then sent the output or error messages back via text.

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
