package com.hex;
import java.util.StringTokenizer;
import java.util.List;

public class Thing {
	 private List actions;
	 public Thing(String startingActions) {  

		 System.out.println("Thing class");
                   StringTokenizer tokenizer = new StringTokenizer(startingActions);
                  while (tokenizer.hasMoreTokens()) {
		 actions.add(tokenizer.nextToken()); }  }  }