package com.ankit.markdownnotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarkdownnotesApplication {

	public static void main(String[] args) {
        System.setProperty(
                "jdk.xml.totalEntitySizeLimit",
                "0"
        );
        SpringApplication.run(MarkdownnotesApplication.class, args);
	}

}
