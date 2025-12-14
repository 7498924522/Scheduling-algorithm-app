package Backend.BB.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Backend.BB.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
