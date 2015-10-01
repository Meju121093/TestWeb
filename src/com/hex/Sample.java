package com.hex;

public class Sample {
 
    
       public String greet(){
       return "Hello, world.. Changed..";
    }
  
  public static void main(String args[]) {
        Sample sample = new Sample();
	System.out.println(sample.greet());
  }
}
