package Backend.BB.controller;

import Backend.BB.entity.User;
import Backend.BB.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("https://scheduling-algorithm-app-zw24.vercel.app/")
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    // Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        userService.registerUser(user);
        return "User registered successfully!";
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        boolean isValid = userService.login(user.getUsername(), user.getPassword());
        // username field will contain either email or username

        if (isValid) {
            return "Login successful!";
        } else {
            return "Invalid username/email or password!";
        }
    }
}
