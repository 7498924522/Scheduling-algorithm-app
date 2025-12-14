package Backend.BB.service;
import Backend.BB.entity.User;
import Backend.BB.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // SIGNUP
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // LOGIN WITH EMAIL OR USERNAME
    public boolean login(String emailOrUsername, String password) {
        User user;

        // Check if user entered an email
        if (emailOrUsername.contains("@")) {
            user = userRepository.findByEmail(emailOrUsername);
        } else {
            user = userRepository.findByUsername(emailOrUsername);
        }

        if (user == null) return false;

        return passwordEncoder.matches(password, user.getPassword());
    }
}