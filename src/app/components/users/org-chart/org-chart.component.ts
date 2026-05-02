import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { UsersService } from '../../../services/users.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-org-chart',
  imports: [OrganizationChartModule],
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss'
})
export class OrgChartComponent implements OnInit, OnDestroy {
  

  userId = input<number>()

  private usersService: UsersService = inject(UsersService);
  private $destroy: Subject<boolean> = new Subject();
  data: TreeNode[] = [];

  ngOnInit(): void {
    this.fetchHeirarchy(this.userId() || 0)
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }



  fetchHeirarchy(userId: number) {
    this.usersService.getUserHierarchy(userId)
      .pipe(
        takeUntil
          (this.$destroy),
        tap((x:any) => {
          console.log(x)

          this.data = this.convertToTreeNode(x.data.userHierarchies)
          console.log(this.data)
        })
      ).subscribe()
  }


  convertToTreeNode(list: any[]) {
    const root: any = [];
    const lastNodeAtLevel: any = {};

    list.forEach(user => {
      // Create the PrimeNG TreeNode structure
      const newNode = {
        label: `${user.firstName} ${user.lastName} (${user.userTypeName})`, // Display name
        data: user,                                 // Store the full object
        expanded: true,                             // Optional: auto-expand
        children: []
      };

      const level = user.level;

      if (level === 0) {
        // Level 0 is a root node
        root.push(newNode);
      } else {
        // Find the parent (which is the last node seen at level - 1)
        // const parent = lastNodeAtLevel[level - 1][0];
        const parent = lastNodeAtLevel[level - 1].find((c: TreeNode) => c.data.userId === user.parentUserId)
        console.log(lastNodeAtLevel[level - 1])
        if (parent) {
          parent.children.push(newNode);
        }
      }

      // Store this node as the latest reference for its level
      if(!lastNodeAtLevel[level]) {
        lastNodeAtLevel[level] = [newNode];
      } else {
        lastNodeAtLevel[level].push(newNode);
      }

    });

    return root;
  }

}
