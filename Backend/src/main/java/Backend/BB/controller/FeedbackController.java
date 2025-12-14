package Backend.BB.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import Backend.BB.entity.Feedback;
import Backend.BB.repository.FeedbackRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Save Feedback
    @PostMapping("/save")
    public Feedback saveFeedback(@RequestBody Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    
}

