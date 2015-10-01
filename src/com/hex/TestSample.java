package com.hex;

import junit.framework.TestCase;
import static junit.framework.Assert.assertEquals;

public class TestSample extends TestCase {
  

  public void testSample() {
	Sample sample = new Sample();
    assertEquals(sample.greet(), "Hello, world");
	System.out.println("TestCase ...testing check");
  }
}
