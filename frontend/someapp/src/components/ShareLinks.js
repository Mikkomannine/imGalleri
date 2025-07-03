import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton
} from 'react-share';

const ShareLinks = ({ shareUrl, username }) => {
    return (
        <div className="sharelinks">
            <button>Share:</button>
            <FacebookShareButton url={shareUrl} title={`Check out ${username}'s profile!`}>
                <img src="/images/facebook.png" alt="Facebook" />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={`Check out ${username}'s profile!`}>
                <img src="/images/twitter.png" alt="Twitter" />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={`Check out ${username}'s profile!`}>
                <img src="/images/linkedin.png" alt="Linkedin" />
            </LinkedinShareButton>
        </div>
    );
};

export default ShareLinks;
