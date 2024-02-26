import PropTypes from 'prop-types';
import {Task} from '../../utils/class';
import {Badge} from '@/components/ui/badge';
import {MemberList} from '../member-list';
import Divider from '../../../../components/general/divider';
import {UserRoundPlus, MoreHorizontal, List, Paperclip, Calendar, Flag} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {useRef} from 'react';
import {useLayoutEffect} from 'react';
import {useState} from 'react';

export const TaskContainer = ({task}) => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  // Calculate current task size
  useLayoutEffect(() => {
    if (ref.current) {
      const newWidth = ref.current.offsetWidth;
      const newHeight = ref.current.offsetHeight;
      setDimensions({width: newWidth, height: newHeight});

      // Prevent value reset
      sessionStorage.setItem('taskDimensions', JSON.stringify({width: newWidth, height: newHeight}));
    }
  }, [task]);

  useLayoutEffect(() => {
    // Retrieve dimensions from local storage when the component mounts
    const storedDimensions = sessionStorage.getItem('taskDimensions');
    if (storedDimensions) {
      const {width, height} = JSON.parse(storedDimensions);
      setDimensions({width, height});
    }
  }, []);

  // Handle drag n drop
  const {setNodeRef, attributes, transform, transition, listeners, isDragging} = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // On drag placeholder
  if (isDragging) {
    return (
      // Task Skeleton
      <div
        ref={setNodeRef}
        style={
          {...style,
            width: dimensions.width + 3,
            height: dimensions.height,
          }
        }
        className='bg-gray-300/60 rounded-md mb-2'
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-white rounded-md border-2 border-slate-200 mb-1'
      {...attributes}
      {...listeners}
    >
      <div ref={ref} className='pl-3 pr-1'>
        <div className='flex justify-between items-center'>
          <div>
            {task.tags && task.tags.map((tag) => (
              <Badge
                key={tag.id}
                className={`${tag.bg} mr-2`}>
                {tag.title}
              </Badge>
            ))}
          </div>

          <Button variant="ghost">
            <MoreHorizontal />
          </Button>
        </div>

        {/* Task Contents */}
        <div className='text-lg font-semibold truncate max-w-52'>
          {task.title}
        </div>

        <div className='text-sm truncate max-w-60'>
          {task.des}
        </div>

        {/* Asignee List */}
        <div className='flex justify-between items-center'>
          <MemberList width={6} height={6} members={task.memList}/>

          <Button variant="ghost">
            <UserRoundPlus className='w-4 h-4'/>
          </Button>
        </div>

        <Divider width='100%' height='1px' color='rgba(0,0,0,0.20)'/>

        {/* Helper Buttons */}
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 text-sm'>
            <div className='flex items-center gap-1 hover:bg-slate-300/20 hover:rounded-md p-2'>
              <List className='w-4 h-5'/>3
            </div>

            <div className='flex items-center gap-1 hover:bg-slate-300/20 hover:rounded-md p-2'>
              <Paperclip className='w-4 h-5'/>2
            </div>

            <div className='flex items-center gap-1 hover:bg-slate-300/20 hover:rounded-md p-2'>
              <Calendar className='w-4 h-5'/>3 days left
            </div>
          </div>

          <Button variant="ghost">
            <Flag className='w-4 h-4'/>
          </Button>
        </div>
      </div>
    </div>
  );
};

TaskContainer.propTypes = {
  task: PropTypes.instanceOf(Task),
};