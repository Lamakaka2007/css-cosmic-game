package org.example.csssimplegame;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("levelTitle", "Level 1: First Flight");
        model.addAttribute(
                "instruction",
                "Move the ship to the red target at column 5, row 5."
        );
        model.addAttribute("targetColumn", 5);
        model.addAttribute("targetRow", 5);
        model.addAttribute(
                "starterCode",
                ".ship {\n    grid-column: 1;\n    grid-row: 1;\n}"
        );

        return "index";
    }
}