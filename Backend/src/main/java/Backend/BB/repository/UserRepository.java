package Backend.BB.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import Backend.BB.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
}
